//Author: ABhivaadya Sharma

// Shared interactions used across the website.
document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

  // Dark mode: remember the choice on this device.
  const themeButton = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
  if (themeButton) {
    themeButton.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const theme = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("portfolio-theme", theme);
      themeButton.textContent = theme === "dark" ? "☀" : "☾";
    });
  }

  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
  }

  // Back-to-top button
  const topButton = document.querySelector(".back-to-top");
  if (topButton) {
    window.addEventListener("scroll", () => topButton.classList.toggle("visible", window.scrollY > 350));
    topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Fun-fact accordion
  document.querySelectorAll(".accordion-trigger").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  // Image carousel
  const slides = [...document.querySelectorAll(".carousel-slide")];
  const dotsContainer = document.querySelector(".carousel-dots");
  if (slides.length && dotsContainer) {
    let current = 0;
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show image ${index + 1}`);
      dot.addEventListener("click", () => showSlide(index));
      dotsContainer.appendChild(dot);
    });
    const dots = [...dotsContainer.children];
    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    }
    document.querySelector(".carousel-arrow.prev")?.addEventListener("click", () => showSlide(current - 1));
    document.querySelector(".carousel-arrow.next")?.addEventListener("click", () => showSlide(current + 1));
    showSlide(0);
  }

  // Contact demo: stores messages only in this browser.
  const contactForm = document.querySelector("#contact-form");
  const savedMessages = document.querySelector("#saved-messages");
  const status = document.querySelector("#form-status");
  if (contactForm && savedMessages) {
    const key = "portfolio-shoutouts";
    function renderMessages() {
      const messages = JSON.parse(localStorage.getItem(key) || "[]");
      savedMessages.innerHTML = messages.map(message =>
        `<div class="saved-message"><strong>${escapeHTML(message.name)}</strong><p>${escapeHTML(message.message)}</p></div>`
      ).join("");
    }
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = contactForm.elements.name.value.trim();
      const message = contactForm.elements.message.value.trim();
      if (!name || !message) return;
      const messages = JSON.parse(localStorage.getItem(key) || "[]");
      messages.unshift({ name, message });
      localStorage.setItem(key, JSON.stringify(messages.slice(0, 10)));
      contactForm.reset();
      status.textContent = "Your message has been saved on this device!";
      renderMessages();
    });
    renderMessages();
  }
});

// Escape text before inserting user-entered content into HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
