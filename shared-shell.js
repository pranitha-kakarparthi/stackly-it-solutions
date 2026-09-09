const innerHeader = document.querySelector(".inner-header");
const innerFooter = document.querySelector(".inner-footer");

if (innerHeader) {
  innerHeader.innerHTML = `<div class="container nav-inner"><a class="brand" href="index.html" aria-label="Stackly home"><img src="logoStackly.webp" alt="Stackly"></a><button class="menu-toggle" id="innerMenuToggle" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button><div class="nav-menu" id="innerNavMenu"><div class="nav-links"><a class="nav-link" href="index.html">Home</a><a class="nav-link" href="about.html">About</a><a class="nav-link" href="services.html">Services</a><a class="nav-link" href="solutions.html">Solutions</a><a class="nav-link" href="industries.html">Industries</a><a class="nav-link" href="blog.html">Blog</a><a class="nav-link" href="contact.html">Contact</a><a class="nav-link" href="sign-in.html">Sign in</a></div><a class="button button-small button-primary" href="sign-up.html">Create account <i class="fa-solid fa-arrow-right"></i></a></div></div>`;
  const toggle = document.querySelector("#innerMenuToggle");
  const menu = document.querySelector("#innerNavMenu");
  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
  });
  menu
    ?.querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => menu.classList.remove("open"))
    );
}

if (innerFooter) {
  const form = innerFooter.querySelector(".inner-newsletter");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const message = form.querySelector("small");
    message.textContent = input.validity.valid
      ? "You are on the list."
      : "Enter a valid email.";
    message.classList.toggle("error", !input.validity.valid);
    if (input.validity.valid) form.reset();
  });
}
