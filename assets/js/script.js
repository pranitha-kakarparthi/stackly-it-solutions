const navbar = document.querySelector("#navbar");
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const backToTop = document.querySelector("#backToTop");

// Keep navigation state and the mobile menu in sync with the page.
// Locks background scroll completely when mobile menu is open.
const closeMenu = () => {
  navMenu.classList.remove("open");
  document.body.classList.remove("nav-open");
  document.documentElement.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  document.body.classList.toggle("nav-open", isOpen);
  document.documentElement.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

const updateScrollUI = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 550);
};
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

// Reveal content only as it enters the viewport for a lighter initial render.
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

// Highlight the navigation item for the section currently in view.
const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const current = entry.target.id;
        navLinks.forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${current}`
          )
        );
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);
sections.forEach((section) => sectionObserver.observe(section));

backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// Count statistics once, when the stats band is visible.
const statsSection = document.querySelector(".stats-section");
const counters = document.querySelectorAll(".counter");
let countersStarted = false;
const animateCounters = () => {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};
new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) animateCounters();
  },
  { threshold: 0.35 }
).observe(statsSection);

// Lightweight testimonial carousel with keyboard-friendly buttons.
const track = document.querySelector("#testimonialTrack");
const currentSlide = document.querySelector("#slideCurrent");
const slides = [...document.querySelectorAll(".testimonial-card")];
let slideIndex = 0;
const showSlide = (index) => {
  slideIndex = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
  currentSlide.textContent = String(slideIndex + 1).padStart(2, "0");
};
document
  .querySelector("#prevTestimonial")
  .addEventListener("click", () => showSlide(slideIndex - 1));
document
  .querySelector("#nextTestimonial")
  .addEventListener("click", () => showSlide(slideIndex + 1));

// Frontend-only newsletter validation with a useful success state.
const newsletterForm = document.querySelector("#newsletterForm");
const emailInput = document.querySelector("#email");
const formMessage = document.querySelector("#formMessage");

// Apply the Stackly brand and shared contact destinations from one source.
document.title = "Stackly | Intelligent technology for ambitious teams";
const description = document.querySelector('meta[name="description"]');
if (description)
  description.setAttribute(
    "content",
    "Stackly builds intelligent digital products, cloud systems, and secure technology solutions for ambitious businesses."
  );
document.querySelectorAll(".brand").forEach((brand) => {
  brand.innerHTML = '<img src="assets/images/logoStackly.webp" alt="Stackly">';
  brand.setAttribute("aria-label", "Stackly home");
});
document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.href = "mailto:hello@thestackly.com";
});
const socialLinks = document.querySelector(".socials");
if (socialLinks) {
  socialLinks.innerHTML = [
    ["Facebook", "fa-facebook-f"],
    ["Instagram", "fa-instagram"],
    ["YouTube", "fa-youtube"],
    ["Twitter", "fa-x-twitter"],
    ["LinkedIn", "fa-linkedin-in"],
  ]
    .map(
      ([label, icon]) =>
        `<a href="404.html" aria-label="${label}"><i class="fa-brands ${icon}"></i></a>`
    )
    .join("");
}
newsletterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!emailInput.validity.valid) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.classList.add("error");
    emailInput.focus();
    return;
  }

  newsletterForm.reset();
  window.location.href = "404.html";
});
emailInput.addEventListener("input", () => {
  formMessage.textContent = "";
  formMessage.classList.remove("error");
});

// Allow Escape to close the mobile navigation.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("open")) closeMenu();
});
