function toggleAnswer(questionElement) {
  const faqItem = questionElement.parentNode;
  const answerElement = faqItem.querySelector(".faq-answer");
  const plusIcon = questionElement.querySelector(".plus-icon");

  const isVisible = answerElement.style.display === "block";
  document
    .querySelectorAll(".faq-answer")
    .forEach((ans) => (ans.style.display = "none"));
  document
    .querySelectorAll(".plus-icon")
    .forEach((icon) => (icon.textContent = "+"));

  if (!isVisible) {
    answerElement.style.display = "block";
    plusIcon.textContent = "-";
  }
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

// FAQ toggle animation
function toggleAnswer(questionElement) {
  const faqItem = questionElement.parentNode;
  const answerElement = faqItem.querySelector(".faq-answer");
  const plusIcon = questionElement.querySelector(".plus-icon");

  const isVisible = answerElement.style.display === "block";

  // Hide all
  document
    .querySelectorAll(".faq-answer")
    .forEach((ans) => (ans.style.display = "none"));
  document
    .querySelectorAll(".plus-icon")
    .forEach((icon) => (icon.textContent = "+"));

  // Animate only the clicked one
  if (!isVisible) {
    answerElement.style.display = "block";
    plusIcon.textContent = "-";

    anime({
      targets: answerElement,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 400,
      easing: "easeOutExpo",
    });
  }
}

// Animate FAQ items on load
anime({
  targets: ".faq-item",
  opacity: [0, 1],
  translateY: [30, 0],
  delay: anime.stagger(120),
  duration: 800,
  easing: "easeOutCubic",
});

// Logo glow pulse
anime({
  targets: ".logo-over-arc",
  scale: [1, 1.05],
  direction: "alternate",
  easing: "easeInOutSine",
  duration: 1500,
  loop: true,
});

// Navigation hover effect
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    anime({
      targets: link,
      color: "#ff00ff",
      duration: 300,
      easing: "easeInOutQuad",
    });
  });
  link.addEventListener("mouseleave", () => {
    anime({
      targets: link,
      color: "#ffffff",
      duration: 300,
      easing: "easeInOutQuad",
    });
  });
});

// Animate background images when they enter view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 700,
          easing: "easeOutCubic",
        });
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".glow-image").forEach((img) => {
  observer.observe(img);
});
// Animate FAQ items on load with floating effect
anime({
  targets: ".faq-item",
  opacity: [0, 1],
  translateY: [30, 0],
  delay: anime.stagger(120), // Delay between each FAQ item animation
  duration: 800,
  easing: "easeOutCubic",
});
