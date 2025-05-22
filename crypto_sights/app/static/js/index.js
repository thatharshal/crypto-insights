document.addEventListener('DOMContentLoaded', function() {
    // Initialize anime.js animations for floating elements
    anime({
        targets: '.floating-element',
        translateY: [-10, 10],
        duration: 3000,
        direction: 'alternate',
        easing: 'easeInOutSine',
        loop: true
    });

    // Pulse animation for CTA buttons
    anime({
        targets: '.pulse-element',
        scale: [1, 1.05],
        duration: 1500,
        direction: 'alternate',
        easing: 'easeInOutSine',
        loop: true
    });

    // Floating crypto elements animation
    const floatingCryptos = document.querySelectorAll('.floating-crypto, .crypto-grid-element');
    floatingCryptos.forEach((el, index) => {
        anime({
            targets: el,
            translateY: ['100vh', '-100vh'],
            rotate: 360,
            duration: 15000 + (index * 2000),
            easing: 'linear',
            loop: true,
            delay: index * 1000
        });
    });

    // Market pulse animation
    anime({
        targets: '.market-line',
        scaleX: [0.8, 1.2],
        opacity: [0.5, 1],
        duration: 8000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true
    });

    // Dot pulse animation
    anime({
        targets: '.market-dot, .chart-point',
        scale: [1, 1.5],
        opacity: [0.8, 1],
        duration: 2000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(500)
    });

    // Typewriter effect for search placeholder
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        const questions = [
            "How's Solana's proof of history tech holding up?",
            "Can crypto replace traditional currencies someday?",
            "Insights about the hamster coin...",
            "Analyze Ethereum network activity..."
        ];
        let currentQuestion = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeWriter() {
            const fullText = questions[currentQuestion];

            if (isDeleting) {
                searchInput.placeholder = fullText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Delete faster
            } else {
                searchInput.placeholder = fullText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100; // Type slower
            }

            if (!isDeleting && charIndex === fullText.length) {
                // Pause at the end of typing
                isDeleting = true;
                typingSpeed = 1500; // Wait before deleting
            } else if (isDeleting && charIndex === 0) {
                // Move to next question
                isDeleting = false;
                currentQuestion = (currentQuestion + 1) % questions.length;
                typingSpeed = 500; // Pause before typing next question
            }

            setTimeout(typeWriter, typingSpeed);
        }

        // Start the typewriter effect
        setTimeout(typeWriter, 1000);
    }

    // Scroll animations for sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all section titles and cards for animation on scroll
    document.querySelectorAll('.section-title, .insight-card, .coin-card').forEach(el => {
        observer.observe(el);
    });

    // Simulate crypto chart animation
    animateChart();

    // Search box functionality
    const searchBox = document.querySelector('.search-box');
    const analyzeButton = searchBox ? searchBox.querySelector('button') : null;

    if (analyzeButton) {
        analyzeButton.addEventListener('click', function() {
            const searchValue = searchBox.querySelector('input').value.trim();
            if (searchValue) {
                // Simulate loading state
                analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                analyzeButton.disabled = true;

                // Simulate API call delay
                setTimeout(() => {
                    // Reset button
                    analyzeButton.innerHTML = 'Analyze';
                    analyzeButton.disabled = false;

                }, 2000);
            }
        });
    }

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

    // Fetch live prices as soon as the page loads
    updateCryptoPrices();

    // Start updating prices every 50 seconds
    setInterval(updateCryptoPrices, 50000);

    // Refresh chart every 55 seconds
    setInterval(animateChart, 55000);
});

// Function to animate the crypto chart
function animateChart() {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) return;

    // Create random data points for the chart
    const dataPoints = [];
    const numPoints = 50;

    for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * 100;
        const y = 30 + Math.random() * 40; // Random value between 30-70%
        dataPoints.push({ x, y });
    }

    // Clear existing points
    const existingPoints = chartContainer.querySelectorAll('.chart-point:not([style])');
    existingPoints.forEach(point => point.remove());

    // Add new points
    dataPoints.forEach(point => {
        const pointElement = document.createElement('div');
        pointElement.classList.add('chart-point');
        pointElement.style.left = `${point.x}%`;
        pointElement.style.bottom = `${point.y}%`;
        chartContainer.appendChild(pointElement);
    });

    // Animate the line connecting the points
    const chartLine = chartContainer.querySelector('.chart-line');
    if (chartLine) {
        // Calculate average height for the line
        const avgHeight = dataPoints.reduce((sum, point) => sum + point.y, 0) / dataPoints.length;
        chartLine.style.bottom = `${avgHeight}%`;

        anime({
            targets: chartLine,
            scaleX: [0, 1],
            opacity: [0, 1],
            duration: 1500,
            easing: 'easeInOutQuad'
        });
    }

    // Animate the points appearing
    anime({
        targets: '.chart-point',
        scale: [0, 1],
        opacity: [0, 1],
        delay: anime.stagger(50),
        duration: 1000,
        easing: 'easeOutElastic(1, .5)'
    });
}

// Update crypto prices periodically
function updateCryptoPrices() {
    const coinCards = document.querySelectorAll('.coin-card');

    // Collect unique coin IDs from data attributes
    const coinIds = Array.from(coinCards).map(card => card.getAttribute('data-coin')).join(',');

    // Check if data is cached and valid
    if (isCacheValid()) {
        const cachedData = JSON.parse(localStorage.getItem('coinPrices'));
        updatePricesInUI(cachedData);
    } else {
        // Fetch prices for all coins in one API call
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('coinPrices', JSON.stringify(data));
                localStorage.setItem('cacheTime', Date.now());
                updatePricesInUI(data);
            })
            .catch(error => {
                console.error('Error fetching data from CoinGecko:', error);
            });
    }
}

// Check if the cache is valid (not older than 60 seconds)
function isCacheValid() {
    const cacheTime = localStorage.getItem('cacheTime');
    return cacheTime && (Date.now() - cacheTime < 60000);  // Cache valid for 60 seconds
}

// Update the prices in the UI
function updatePricesInUI(data) {
    const coinCards = document.querySelectorAll('.coin-card');

    coinCards.forEach(card => {
        const coinId = card.getAttribute('data-coin');
        const priceElement = card.querySelector('.price');
        const price = data[coinId]?.usd;

        if (price && priceElement) {
            // Adaptive formatting for prices
            let displayPrice;
            if (price >= 1) {
                displayPrice = `$${price.toFixed(2)}`;
            } else if (price >= 0.01) {
                displayPrice = `$${price.toFixed(4)}`;
            } else if (price >= 0.0001) {
                displayPrice = `$${price.toFixed(4)}`;
            } else {
                displayPrice = `$${price.toFixed(10)}`; // Scientific notation for really tiny prices
            }

            priceElement.textContent = displayPrice;

            // Tooltip for full price value
            priceElement.title = `$${price}`;
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const analyzeButton = document.querySelector(".search-box button");
    const inputField = document.querySelector(".search-box input");

    analyzeButton.addEventListener("click", () => {
        const query = inputField.value.trim();
        if (!query) return;

        // Redirect to mainquery.html with query as URL param
        const encodedQuery = encodeURIComponent(query);
        window.location.href = `main?query=${encodedQuery}&coin=general crypto`;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const analyzeBtn = document.getElementById("analyze-btn");
    const input = document.getElementById("landing-query-input");
  
    analyzeBtn.addEventListener("click", function (e) {
      e.preventDefault(); // prevent default form submission
  
      const query = input.value.trim();
      if (!query) return;
  
      // Store query in localStorage
      localStorage.setItem("preset_query", query);
      localStorage.setItem("preset_coin", "general crypto");
  
      // Redirect to mainquery.html
      window.location.href = "/main_query.html"; // This loads mainquery.html
    });
  });

  