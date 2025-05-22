function scrollToCard(index) {
  const container = document.getElementById("storyCards");
  const cards = container.querySelectorAll(".story-card");
  const dots = document.querySelectorAll(".dot-indicator");
  const cardWidth = 310; // Card width + gap

  if (cards[index]) {
    container.scrollLeft = index * cardWidth;

    // Update active dot
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }
}

function scrollStory(direction) {
  const container = document.getElementById("storyCards");
  const cardWidth = 310;
  const scrollAmount = direction * cardWidth;

  container.scrollBy({ left: scrollAmount, behavior: "smooth" });

  // Update active dot after scroll
  setTimeout(() => {
    const currentScroll = container.scrollLeft;
    const visibleIndex = Math.round(currentScroll / cardWidth);
    const dots = document.querySelectorAll(".dot-indicator");

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === visibleIndex);
    });
  }, 300);
}

document.addEventListener("DOMContentLoaded", function () {
  // Story Carousel Setup
  const carousel = document.querySelector(".carousel");
  const cards = document.querySelectorAll(".card");
  const dots = document.querySelectorAll(".dot-indicator");
  const leftArrow = document.querySelector(".arrow-left");
  const rightArrow = document.querySelector(".arrow-right");

  let currentIndex = 0;
  const totalCards = cards.length;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 30;
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  if (dots.length > 0) dots[0].classList.add("active");

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateCarousel();
    });
  });

  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    });
  }

  updateCarousel();

  // Story Scroll Progress
  const storyContainer = document.getElementById("storyCards");
  const progressEl = document.getElementById("storyProgress");

  if (storyContainer && progressEl) {
    storyContainer.addEventListener("scroll", () => {
      const maxScroll = storyContainer.scrollWidth - storyContainer.clientWidth;
      const pct = (storyContainer.scrollLeft / maxScroll) * 100;
      progressEl.style.width = pct + "%";
    });
  }

  // Footer Navigation Link Active State
  document.querySelectorAll(".footer-col ul li a").forEach((link) => {
    link.addEventListener("click", function () {
      document
        .querySelectorAll(".footer-col ul li a")
        .forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
});
