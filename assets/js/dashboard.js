const session = window.StacklySession.readSession();
if (!session) {
  window.location.replace("sign-in.html");
} else {
  const name = session.name || "there";
  document.querySelector("#userName").textContent =
    session.name || "Stackly user";
  document.querySelector("#userRole").textContent =
    session.role || "Workspace member";
  document.querySelector("#greetingName").textContent = `${name}.`;
  document.querySelector("#userAvatar").textContent = name
    .slice(0, 1)
    .toUpperCase();
}

// Sign out clears the active session and returns to login
document.querySelector("#signOut")?.addEventListener("click", () => {
  window.StacklySession.clearSession();
  window.location.href = "sign-in.html";
});

// Any interactive action trigger inside dashboard routes to 404 (except signout and brand)
document
  .querySelector(".dashboard-main")
  ?.addEventListener("click", (event) => {
    const target = event.target.closest("button, .action-trigger");
    if (target && target.id !== "signOut" && !target.closest(".brand")) {
      event.preventDefault();
      window.location.href = "../404.html";
    }
  });
