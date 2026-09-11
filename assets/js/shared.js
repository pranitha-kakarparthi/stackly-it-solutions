const sessionKey = "stackly.currentUser";

const removeLoader = () => {
  const loader = document.querySelector("#siteLoader");
  if (!loader) return;
  loader.classList.add("is-hidden");
  window.setTimeout(() => loader.remove(), 250);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", removeLoader, { once: true });
} else {
  removeLoader();
}
window.setTimeout(removeLoader, 3500);

const saveSession = (user) => {
  localStorage.setItem(
    sessionKey,
    JSON.stringify({ ...user, loggedInAt: new Date().toISOString() })
  );
};
const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
};
const clearSession = () => {
  localStorage.removeItem(sessionKey);
};

window.StacklySession = { saveSession, readSession, clearSession };

/* ==========================================================================
   Global Scroll-to-Top Button
   Ensures every page on Stackly has a functional, smooth scroll-to-top button.
   ========================================================================== */
const initScrollToTop = () => {
  let backToTop = document.querySelector("#backToTop");
  if (!backToTop) {
    backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.id = "backToTop";
    backToTop.type = "button";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
  }

  // Bind scroll detection and smooth scrolling if not already initialized
  if (!backToTop.dataset.bound) {
    backToTop.dataset.bound = "true";
    const updateVisibility = () => {
      backToTop.classList.toggle("visible", window.scrollY > 350);
    };
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollToTop, {
    once: true,
  });
} else {
  initScrollToTop();
}
