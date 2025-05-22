# Define cryptocurrency-related terms
crypto_terms = {
    "bitcoin", "ethereum", "blockchain", "dogecoin", "litecoin", "ripple",
    "cardano", "solana", "polkadot", "chainlink", "uniswap", "binance",
    "coinbase", "ftx", "kraken", "defi", "nft", "metaverse", "web3", "usdt",
    "crypto", "Cryptocurrency", "Digital currency", "Virtual currency", "Decentralized finance",
    "Web3", "Digital assets", "Crypto assets", "Bitcoin", "BTC", "Ethereum", "ETH", "Altcoins",
    "Stablecoins", "Tether", "USDC", "Memecoins", "Shiba Inu", "Crypto exchange",
    "Decentralized exchange", "DEX", "Centralized exchange", "CEX", "Trading pairs",
    "Order book", "Liquidity", "Trading volume", "Market cap", "Market capitalization",
    "Bull market", "Bear market", "Volatility", "Technical analysis", "Fundamental analysis",
    "Trading bots", "Crypto wallet", "Digital wallet", "Hardware wallet", "Cold wallet",
    "Software wallet", "Hot wallet", "Private key", "Public key", "Seed phrase",
    "Cryptography", "Security audit", "Decentralization", "Distributed ledger technology",
    "DLT", "Smart contracts", "Consensus mechanism", "Tokenomics", "DeFi protocols",
    "Yield farming", "Liquidity mining", "Polygon", "Arbitrum", "Optimism", "Sidechains",
    "Sharding", "Zero-knowledge proofs", "zk-SNARKs", "zk-STARKs", "Interoperability",
    "Cosmos", "Oracles", "Cryptographic primitives", "Merkle tree", "Byzantine F",
    "Crypto mining", "Proof-of-Work", "PoW", "Proof-of-Stake", "PoS", "Staking",
    "Mining rig", "Hash rate", "Validator", "Crypto regulation", "KYC",
    "Know Your Customer", "AML", "Anti-Money Laundering", "Compliance", "NFT marketplace",
    "Digital art", "Collectibles", "Minting", "Gas fees", "Crypto investment", "Portfolio",
    "Hodl", "DCA", "Dollar-cost averaging", "Yield", "APY", "DAOs",
    "Decentralized Autonomous Organizations", "Airdrop", "hamstercoin", "token",
    "altcoin", "market", "coin", "price", "trend", "exchange","invest", "crypto currency", "decentralized"
}

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