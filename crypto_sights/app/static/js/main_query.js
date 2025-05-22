function sendQuery() {
  const coin = document.getElementById('coin-select').value;
  const query = document.getElementById('query').value.trim();

  if (!query) {
    alert('Please enter a query.');
    return;
  }

  // Hide previous results and show loader
  document.querySelector('.button-group').style.display = 'none';
  document.getElementById('answer-box').style.display = 'none';
  document.getElementById('loading').style.display = 'block';

  // Simulate loading for 2.5 seconds
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
      const answers = data.answers || data.top_answers || [];

      const formattedAnswers = answers.map(ans => {
        if (typeof ans === 'string') {
          return `<li>${ans.replace(/^[-\d\.\s]+/, '').replace(/\n/g, ' ').trim()}</li>`;
        } else {
          return `<li>
            <strong>Confidence:</strong> ${(ans.confidence * 100).toFixed(2)}%<br>
            <strong>Excerpt:</strong> ${ans.excerpt}<br>
            <strong>Context:</strong> ${ans.source_context}<br>
          </li><br>`;
        }
      }).join('');

      document.getElementById('answer-box').innerHTML = `
        <p><strong>Coin:</strong> ${capitalize(coin)}</p>
        <p><strong>Question:</strong> ${query}</p>
        <p><strong>Sentiment:</strong> ${sentiment}</p>
        ${summary ? `<p><strong>Summary:</strong> ${summary}</p>` : ''}
        <p><strong>Top Answers:</strong></p>
        <ol>${formattedAnswers}</ol>
      `;

      // Hide loader and show result
      document.getElementById('loading').style.display = 'none';
      document.getElementById('answer-box').style.display = 'block';

    })
    .catch(err => {
      document.getElementById('answer-box').innerHTML = `<p style="color: red;">${err.message}</p>`;
      document.getElementById('loading').style.display = 'none';
      document.getElementById('answer-box').style.display = 'block';
    });
  }, 2500);
}
 // wait 2.5s before processing fetch


document.addEventListener("DOMContentLoaded", function () {
  // Ensure loading is hidden initially
  // document.getElementById('loading').style.display = 'none';
// Mobile menu toggle
    const menuButton = document.querySelector('nav button.md\\:hidden');
    const mobileMenu = document.querySelector('nav .hidden.md\\:flex');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex', 'flex-col', 'absolute', 'top-20', 'left-0', 'right-0', 'bg-dark', 'p-4', 'z-50');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex', 'flex-col', 'absolute', 'top-20', 'left-0', 'right-0', 'bg-dark', 'p-4', 'z-50');
            }
        });
    }
    
  // Preset buttons
  const presetButtons = document.querySelectorAll("#preset-buttons button");
  const queryInput = document.getElementById("query");

  presetButtons.forEach(button => {
    button.addEventListener("click", () => {
      queryInput.value = button.innerText;
      document.getElementById("coin-select").value = "general crypto";
      sendQuery();
    });
  });

  // Handle pre-filled URL parameters
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  const coin = params.get("coin") || "general crypto";

  if (query) {
    const queryInput = document.getElementById("query");
    const coinSelect = document.getElementById("coin-select");

    if (queryInput && coinSelect) {
      queryInput.value = decodeURIComponent(query);
      coinSelect.value = coin;

      setTimeout(() => {
        sendQuery();
      }, 500);
    }
  }
});

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
