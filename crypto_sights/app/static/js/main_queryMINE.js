function sendQuery() {
  const coin = document.getElementById('coin-select').value;
  const query = document.getElementById('query').value;

  // Show loading
  document.querySelector('.button-group').style.display = 'none';
  // document.getElementById('loading').style.display = 'block';
  document.getElementById('answer-box').style.display = 'none';
  
  setTimeout(() => {
    fetch(`${window.location.origin}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin, query })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || 'Something went wrong');
        });
      }
      return res.json();
    })
    .then(data => {
      const sentiment = data.analysis?.sentiment || 'N/A';
      const summary = data.analysis?.summary || '';
      const answers = data.answers || [];

      const formattedAnswers = answers
        .map(ans => `<li>
          <strong>Confidence:</strong> ${(ans.confidence * 100).toFixed(2)}%<br>
          <strong>Excerpt:</strong> ${ans.excerpt}<br>
          <strong>Context:</strong> ${ans.source_context}
        </li> <br>`)
        .join('');


      document.getElementById('answer-box').innerHTML = `
        <p><strong>Coin:</strong> ${capitalize(coin)}</p>
        <p><strong>Question:</strong> ${query}</p>
        <p><strong>Sentiment:</strong> ${sentiment}</p>
        ${summary ? `<p><strong>Summary:</strong> ${summary}</p>` : ''}
        <p><strong>Top Answers:</strong></p>
        <ol>${formattedAnswers}</ol>
      `;

      // document.getElementById('loading').style.display = 'none';
      document.getElementById('answer-box').style.display = 'block';
      document.querySelector('.button-group').style.display = 'flex'; // Optional: show buttons again
    })
    .catch(err => {
      document.getElementById('answer-box').innerHTML = `<p style="color: red;">${err.message}</p>`;
      // document.getElementById('loading').style.display = 'none';
      document.getElementById('answer-box').style.display = 'block';
    });
  }, 3000);
}
document.addEventListener("DOMContentLoaded", function () {
  const presetButtons = document.querySelectorAll("#preset-buttons button");
  const queryInput = document.getElementById("query");

  presetButtons.forEach(button => {
    button.addEventListener("click", () => {
      queryInput.value = button.innerText;    
      document.getElementById("coin-select").value = "general crypto";  
      sendQuery(); 
    });
  });
});

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);


document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  const coin = params.get("coin") || "general crypto";

  if (query) {
    const queryInput = document.getElementById("query");
    const coinSelect = document.getElementById("coin-select");

    if (queryInput && coinSelect) {
      queryInput.value = decodeURIComponent(query);
      coinSelect.value = coin;

      // Ensure the DOM is fully painted before calling sendQuery
      setTimeout(() => {
        sendQuery();
      }, 500); // small delay allows fields to fully register values
    }
  }
});
