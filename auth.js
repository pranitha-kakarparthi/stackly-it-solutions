const signInForm = document.querySelector("#signInForm");
const signUpForm = document.querySelector("#signUpForm");
const authStatus = document.querySelector("#authStatus");

const showValidation = (form, firstInvalid) => {
  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
  if (authStatus) authStatus.textContent = "";
  if (!firstInvalid) return true;
  const error =
    firstInvalid.closest("div")?.querySelector(".field-error") ||
    firstInvalid.nextElementSibling;
  if (error)
    error.textContent =
      firstInvalid.type === "email"
        ? "Enter a valid email address."
        : "Please complete this field.";
  firstInvalid.focus();
  return false;
};

const siginPasswordInput = document.getElementById("loginPassword");
const signIntoggleEye = document.getElementById("signIntoggleEye");

signIntoggleEye &&
  signIntoggleEye.addEventListener("click", () => {
    const signInType =
      siginPasswordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    siginPasswordInput.setAttribute("type", signInType);

    signIntoggleEye.style.color = signInType === "text" ? "blue" : "#555";
  });

const signupPasswordInput = document.getElementById("signupPassword");
const signupToggleEye = document.getElementById("signupToggleEye");

signupToggleEye &&
  signupToggleEye.addEventListener("click", () => {
    const signupType =
      signupPasswordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    signupPasswordInput.setAttribute("type", signupType);

    signupToggleEye.style.color = signupType === "text" ? "blue" : "#555";
  });

const signupConfirmPasswordInput = document.getElementById(
  "signupConfirmPassword"
);
const signupConfirmToggleEye = document.getElementById(
  "signupConfirmToggleEye"
);

signupConfirmToggleEye &&
  signupConfirmToggleEye.addEventListener("click", () => {
    const signupConfirmType =
      signupConfirmPasswordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    signupConfirmPasswordInput.setAttribute("type", signupConfirmType);

    signupConfirmToggleEye.style.color =
      signupConfirmType === "text" ? "blue" : "#555";
  });

signInForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const invalid = [...signInForm.querySelectorAll("[required]")].find(
    (field) => !field.value.trim() || !field.validity.valid
  );
  if (!showValidation(signInForm, invalid)) return;
  const email = document.querySelector("#loginEmail").value.trim();
  const role = document.querySelector("#loginRole").value;
  window.StacklySession.saveSession({ name: email.split("@")[0], email, role });
  authStatus.textContent = "Signed in. Opening your workspace...";
  window.setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 350);
});

signUpForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = document.querySelector("#signupPassword");
  const confirmPassword = document.querySelector("#signupConfirmPassword");
  const invalid = [...signUpForm.querySelectorAll("[required]")].find(
    (field) =>
      (field.type === "checkbox" && !field.checked) ||
      (field.type !== "checkbox" &&
        (!field.value.trim() || !field.validity.valid))
  );
  if (!showValidation(signUpForm, invalid)) return;
  if (password.value !== confirmPassword.value) {
    confirmPassword.nextElementSibling.textContent = "Passwords must match.";
    confirmPassword.focus();
    return;
  }
  const firstName = document.querySelector("#firstName").value.trim();
  const lastName = document.querySelector("#lastName").value.trim();
  const email = document.querySelector("#signupEmail").value.trim();
  const role = document.querySelector("#signupRole").value;
  const users = JSON.parse(localStorage.getItem("stackly.users") || "[]");
  users.push({ firstName, lastName, email, role });
  localStorage.setItem("stackly.users", JSON.stringify(users));
  authStatus.textContent = "Account created. Redirecting to sign in...";
  window.setTimeout(() => {
    window.location.href = "sign-in.html";
  }, 500);
});

document
  .querySelectorAll(".auth-form input, .auth-form select")
  .forEach((field) => {
    field.addEventListener("input", () => {
      const error =
        field.closest("div")?.querySelector(".field-error") ||
        field.nextElementSibling;
      if (error?.classList.contains("field-error")) error.textContent = "";
      if (authStatus) authStatus.textContent = "";
    });
  });
