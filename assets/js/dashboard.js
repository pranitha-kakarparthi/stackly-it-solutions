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
document.querySelector("#signOut")?.addEventListener("click", () => {
  window.StacklySession.clearSession();
  window.location.href = "sign-in.html";
});
