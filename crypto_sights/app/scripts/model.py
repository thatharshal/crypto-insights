import os
import re
import pickle
import unidecode
import numpy as np
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
from rank_bm25 import BM25Okapi
from tqdm import tqdm
from .keywords import crypto_terms

# Ensure NLTK data is downloaded only once
nltk_data_path = os.path.expanduser('~/nltk_data')
nltk.download('punkt', download_dir=nltk_data_path)
nltk.download('stopwords', download_dir=nltk_data_path)
nltk.download('wordnet', download_dir=nltk_data_path)

# Initialize NLP tools
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

COINS = ["bitcoin", "ethereum", "solana", "dogecoin", "hamstercoin", "general crypto"]

class CryptoInsightEngine:
    def __init__(self, pickle_path, verbose=True):
        self.verbose = verbose
        self.qa_data = self.load_and_enhance_data(pickle_path)
        self.key_concepts = {
            'investment': ['invest', 'buy', 'sell', 'portfolio', 'return'],
            'technology': ['blockchain', 'AI', 'smart contract', 'protocol'],
            'market': ['volatility', 'trend', 'analysis', 'bullish', 'bearish']
        }
        self.tfidf_vectorizer, self.tfidf_matrix, self.bm25, self.qa_pairs = \
            self.initialize_models()

    # def load_and_enhance_data(self, pickle_path):
    #     try:
    #         with open(pickle_path, 'rb') as f:
    #             raw_data = pickle.load(f)
    #     except (FileNotFoundError, pickle.UnpicklingError, EOFError) as e:
    #         print(f"[Warning] Failed to load '{pickle_path}': {e}")
    #         print("[Info] Creating default QA data...")

    #         raw_data = [
    #             {
    #                 "question": "What is Bitcoin?",
    #                 "answer": "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.",
    #                 "context": "General Crypto Knowledge"
    #             },
    #             {
    #                 "question": "What is Ethereum?",
    #                 "answer": "Ethereum enables smart contracts and decentralized applications to be built and run without downtime or fraud.",
    #                 "context": "Technology Overview"
    #             },
    #             {
    #                 "question": "Should I invest in Solana?",
    #                 "answer": "Solana is a fast blockchain, but investing carries risks due to market volatility.",
    #                 "context": "Investment Advice"
    #             }
    #         ]

    #         # Save it so future runs don't recreate it
    #         with open(pickle_path, 'wb') as f:
    #             pickle.dump(raw_data, f)
    #         print(f"[Info] Saved default data to '{pickle_path}'.")

    #     if isinstance(raw_data, str):
    #         cleaned_text = unidecode.unidecode(raw_data)
    #         chunks = self.create_context_chunks(cleaned_text)
    #         base_data = [{'answer': chunk} for chunk in chunks]
    #     else:
    #         base_data = raw_data

    #     # Enhance with entity-based variations
    #     enhanced_data = []
    #     for entry in base_data:
    #         enhanced_data.append(entry)
    #         answer = entry.get('answer', '')
    #         entities = self.extract_key_entities(answer)
    #         for entity in entities:
    #             enhanced_data.extend([
    #                 {'question': f"What is {entity}?", 'answer': answer},
    #                 {'question': f"Explain {entity}", 'answer': answer},
    #                 {'question': f"Should I invest in {entity}?", 'answer': answer},
    #                 {'question': f"Recent trends of {entity}", 'answer': answer}
    #             ])
    #     return enhanced_data

    def load_and_enhance_data(self, pickle_path):
        """Load and enhance dataset with semantic expansion"""
        with open(pickle_path, 'rb') as f:
            raw_data = pickle.load(f)
        
        # Convert to chunks if raw text
        if isinstance(raw_data, str):
            cleaned_text = unidecode.unidecode(raw_data)
            chunks = self.create_context_chunks(cleaned_text)
            base_data = [{'answer': chunk} for chunk in chunks]
        else:
            base_data = raw_data
        
        # Augment dataset
        enhanced_data = []
        for entry in base_data:
            enhanced_data.append(entry)
            answer = entry.get('answer', '')
            
            # Generate question variations
            entities = self.extract_key_entities(answer)
            for entity in entities:
                enhanced_data.extend([
                    {'question': f"What is {entity}?", 'answer': answer},
                    {'question': f"Explain {entity}", 'answer': answer},
                    {'question': f"Should I invest in {entity}?", 'answer': answer},
                    {'question': f"Recent trends of {entity}", 'answer': answer}
                ])
        
        return enhanced_data
    

    def create_context_chunks(self, text, chunk_size=500):
        sentences = sent_tokenize(text)
        chunks, current_chunk = [], []
        current_length = 0
        for sent in sentences:
            if current_length + len(sent) <= chunk_size:
                current_chunk.append(sent)
                current_length += len(sent)
            else:
                chunks.append(' '.join(current_chunk))
                current_chunk = [sent]
                current_length = len(sent)
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        return chunks

    def extract_key_entities(self, text):
        entities = set()
        patterns = [
            r'\b[A-Z]{3,5}\b',
            r'\bBitcoin\b', r'\bEthereum\b', r'\bSolana\b',
            r'\b[A-Z][a-z]+coin\b',
            r'\b[A-Z][a-z]+Chain\b'
        ]
        for pattern in patterns:
            entities.update(re.findall(pattern, text))
        return list(entities)

    def preprocess_text(self, text):
        text = unidecode.unidecode(text.lower())
        text = re.sub(r'[^a-z0-9\s-]', '', text)
        tokens = word_tokenize(text)
        return [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]

    def initialize_models(self):
        corpus = []
        for entry in tqdm(self.qa_data, desc="Indexing Content", disable=not self.verbose):
            context = entry.get('context', '')
            combined = f"{entry.get('question', '')} {entry.get('answer', '')} {context}"
            corpus.append(combined)

        tfidf_vectorizer = TfidfVectorizer(
            max_features=10000,
            stop_words='english',
            ngram_range=(1, 3),
            min_df=0.001,
            max_df=0.95
        )
        tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)
        tokenized_corpus = [self.preprocess_text(doc) for doc in corpus]
        bm25 = BM25Okapi(tokenized_corpus)

        return tfidf_vectorizer, tfidf_matrix, bm25, self.qa_data

    def analyze_sentiment(self, text):
        polarity = TextBlob(text).sentiment.polarity
        if polarity > 0.25:
            return "Strong Positive"
        elif polarity > 0.1:
            return "Positive"
        elif polarity < -0.25:
            return "Strong Negative"
        elif polarity < -0.1:
            return "Negative"
        return "Neutral"

    @staticmethod
    def valid_query(query):
        return any(keyword in query.lower() for keyword in crypto_terms)

    def process_query(self, query):
        processed_query = self.preprocess_text(query)
        bm25_scores = self.bm25.get_scores(processed_query)
        query_vector = self.tfidf_vectorizer.transform([query])
        tfidf_scores = cosine_similarity(query_vector, self.tfidf_matrix)[0]

        max_bm25 = max(bm25_scores) or 1
        max_tfidf = max(tfidf_scores) or 1
        combined_scores = [
            (bm25_scores[i]/max_bm25 * 0.7) + (tfidf_scores[i]/max_tfidf * 0.3)
            for i in range(len(self.qa_data))
        ]

        top_indices = np.argsort(combined_scores)[::-1][:10]
        final_results, seen_content = [], set()
        for idx in top_indices:
            result = self.qa_data[idx]
            answer = result.get('answer', '')
            content_hash = hash(answer[:200])
            if content_hash not in seen_content:
                seen_content.add(content_hash)
                score = self.calculate_quality_score(query, answer)
                final_results.append((score, result))
        final_results.sort(reverse=True, key=lambda x: x[0])
        return final_results[:3]

    def calculate_quality_score(self, query, answer):
        query_concepts = self.detect_concepts(query)
        answer_concepts = self.detect_concepts(answer)
        concept_score = len(set(query_concepts) & set(answer_concepts)) * 0.2
        length_score = min(len(answer)/1000, 0.3)
        structure_score = 0.1 if any(c in answer for c in ['•', '- ', ':']) else 0
        recency_score = 0.1 if '202' in answer else 0
        return concept_score + length_score + structure_score + recency_score

    def detect_concepts(self, text):
        detected = []
        text_lower = text.lower()
        for category, terms in self.key_concepts.items():
            if any(term in text_lower for term in terms):
                detected.append(category)
        return detected

    def format_response(self, results, query):
        response = {
            "query": query,
            "answers": [],
            "analysis": {
                "sentiment": "",
                "risk_factors": []
            }
        }
        all_answers = [res['answer'] for _, res in results]
        combined_text = ' '.join(all_answers)
        response['analysis']['sentiment'] = self.analyze_sentiment(combined_text)

        risk_keywords = ['risk', 'volatile', 'uncertain', 'warning']
        response['analysis']['risk_factors'] = list(set(
            [word for word in risk_keywords if word in combined_text.lower()]
        )) or ["General market risks apply"]

        for i, (score, result) in enumerate(results, 1):
            answer = result.get('answer', '')
            response['answers'].append({
                "excerpt": self.truncate_answer(answer),
                "confidence": f"{score:.2f}",
                "source_context": result.get('context', 'Market Analysis')
            })
        return response

    def truncate_answer(self, text, max_length=400):
        if len(text) <= max_length:
            return text
        return text[:max_length].rsplit('. ', 1)[0] + '...'
