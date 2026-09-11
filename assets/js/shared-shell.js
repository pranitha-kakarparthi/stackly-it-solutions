const innerHeader = document.querySelector(".inner-header");
const innerFooter = document.querySelector(".inner-footer");

if (innerHeader) {
  const isInPages = window.location.pathname
    .replace(/\\/g, "/")
    .includes("/pages/");
  const rootPath = isInPages ? "../" : "./";
  const pagesPath = isInPages ? "" : "pages/";
  const assetsPath = isInPages ? "../assets/" : "assets/";

  innerHeader.innerHTML = `<div class="container nav-inner"><a class="brand" href="${rootPath}index.html" aria-label="Stackly home"><img src="${assetsPath}images/logoStackly.webp" alt="Stackly"></a><button class="menu-toggle" id="innerMenuToggle" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button><div class="nav-menu" id="innerNavMenu"><div class="nav-links"><a class="nav-link" href="${rootPath}index.html">Home</a><a class="nav-link" href="${pagesPath}about.html">About</a><a class="nav-link" href="${pagesPath}services.html">Services</a><a class="nav-link" href="${pagesPath}solutions.html">Solutions</a><a class="nav-link" href="${pagesPath}industries.html">Industries</a><a class="nav-link" href="${pagesPath}blog.html">Blog</a><a class="nav-link" href="${pagesPath}contact.html">Contact</a><a class="nav-link" href="${pagesPath}sign-in.html">Sign in</a></div><a class="button button-small button-primary" href="${pagesPath}sign-up.html">Create account <i class="fa-solid fa-arrow-right"></i></a></div></div>`;

  // Highlight the nav link that matches the current page.
  const currentFile =
    window.location.pathname.replace(/\\/g, "/").split("/").pop() ||
    "index.html";
  innerHeader.querySelectorAll(".nav-link").forEach((link) => {
    const linkFile = link.getAttribute("href").split("/").pop();
    if (linkFile === currentFile) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const toggle = document.querySelector("#innerMenuToggle");
  const menu = document.querySelector("#innerNavMenu");

  // Close navigation and restore body scroll
  const closeInnerMenu = () => {
    if (menu) menu.classList.remove("open");
    document.body.classList.remove("nav-open");
    document.documentElement.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }
  };

  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    document.documentElement.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
  });

  menu
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeInnerMenu));
}

if (innerFooter) {
  const isInPages = window.location.pathname
    .replace(/\\/g, "/")
    .includes("/pages/");
  const rootPath = isInPages ? "../" : "./";
  const form = innerFooter.querySelector(".inner-newsletter");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const message = form.querySelector("small");
    message.textContent = input.validity.valid ? "" : "Enter a valid email.";
    message.classList.toggle("error", !input.validity.valid);
    if (input.validity.valid) {
      form.reset();
      window.location.href = `${rootPath}404.html`;
    }
  });
}
