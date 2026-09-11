const signInForm = document.querySelector("#signInForm");
const signUpForm = document.querySelector("#signUpForm");
const authStatus = document.querySelector("#authStatus");

// Accessible password toggle for all password containers
document.querySelectorAll(".password-container").forEach((container) => {
  const input = container.querySelector("input");
  const button = container.querySelector(".toggle-eye");
  if (!input || !button) return;

  button.addEventListener("click", () => {
    const isPassword = input.getAttribute("type") === "password";
    input.setAttribute("type", isPassword ? "text" : "password");
    button.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
    button.classList.toggle("is-active", isPassword);
    const icon = button.querySelector("i");
    if (icon) {
      icon.className = isPassword
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye";
    }
  });
});

// Helper functions for field errors and validation
const getFieldErrorElement = (field) => {
  const group =
    field.closest(".form-group") ||
    field.closest(".check-group") ||
    field.closest(".check-row") ||
    field.parentElement;
  return group ? group.querySelector(".field-error") : null;
};

const setFieldError = (field, message) => {
  const error = getFieldErrorElement(field);
  if (error) {
    error.textContent = message;
  }
  field.classList.add("has-error");
  const group = field.closest(".form-group");
  if (group) group.classList.add("has-error");
};

const clearFieldError = (field) => {
  const error = getFieldErrorElement(field);
  if (error) {
    error.textContent = "";
  }
  field.classList.remove("has-error");
  const group = field.closest(".form-group");
  if (group) group.classList.remove("has-error");
};

const clearFormErrors = (form) => {
  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
  form.querySelectorAll(".has-error").forEach((el) => {
    el.classList.remove("has-error");
  });
  if (authStatus) {
    authStatus.textContent = "";
    authStatus.className = "form-status";
  }
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Sign-in validation
const validateSignIn = () => {
  clearFormErrors(signInForm);
  let firstInvalid = null;

  const emailField = document.querySelector("#loginEmail");
  const passwordField = document.querySelector("#loginPassword");
  const roleField = document.querySelector("#loginRole");

  const email = emailField ? emailField.value.trim() : "";
  if (!email) {
    setFieldError(emailField, "Email address is required.");
    firstInvalid = firstInvalid || emailField;
  } else if (!isValidEmail(email)) {
    setFieldError(emailField, "Please enter a valid email address.");
    firstInvalid = firstInvalid || emailField;
  }

  const password = passwordField ? passwordField.value : "";
  if (!password) {
    setFieldError(passwordField, "Password is required.");
    firstInvalid = firstInvalid || passwordField;
  } else if (password.length < 8) {
    setFieldError(passwordField, "Password must be at least 8 characters.");
    firstInvalid = firstInvalid || passwordField;
  }

  if (roleField && !roleField.value) {
    setFieldError(roleField, "Please choose a role.");
    firstInvalid = firstInvalid || roleField;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
};

// Sign-up validation
// Sign-up validation
const validateSignUp = () => {
  clearFormErrors(signUpForm);
  let firstInvalid = null;

  const firstNameField = document.querySelector("#firstName");
  const lastNameField = document.querySelector("#lastName");
  const emailField = document.querySelector("#signupEmail");
  const phoneField = document.querySelector("#signupPhone");
  const passwordField = document.querySelector("#signupPassword");
  const confirmPasswordField = document.querySelector("#signupConfirmPassword");
  const roleField = document.querySelector("#signupRole");
  const termsField = document.querySelector("#terms");

  // First name validation: alphabetic and spaces only
  const firstName = firstNameField ? firstNameField.value.trim() : "";
  if (!firstName) {
    setFieldError(firstNameField, "First name is required.");
    firstInvalid = firstInvalid || firstNameField;
  } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
    setFieldError(firstNameField, "Only alphabets and spaces are allowed.");
    firstInvalid = firstInvalid || firstNameField;
  }

  // Last name validation: alphabetic and spaces only
  const lastName = lastNameField ? lastNameField.value.trim() : "";
  if (!lastName) {
    setFieldError(lastNameField, "Last name is required.");
    firstInvalid = firstInvalid || lastNameField;
  } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
    setFieldError(lastNameField, "Only alphabets and spaces are allowed.");
    firstInvalid = firstInvalid || lastNameField;
  }

  // Email validation
  const email = emailField ? emailField.value.trim() : "";
  if (!email) {
    setFieldError(emailField, "Email address is required.");
    firstInvalid = firstInvalid || emailField;
  } else if (!isValidEmail(email)) {
    setFieldError(emailField, "Please enter a valid email address.");
    firstInvalid = firstInvalid || emailField;
  }

  // Mobile number validation: exactly 10 digits
  const phone = phoneField ? phoneField.value.trim() : "";
  if (!phone) {
    setFieldError(phoneField, "Mobile number is required.");
    firstInvalid = firstInvalid || phoneField;
  } else if (!/^\d{10}$/.test(phone)) {
    setFieldError(phoneField, "Please enter a valid 10-digit mobile number.");
    firstInvalid = firstInvalid || phoneField;
  }

  // Password validation
  const password = passwordField ? passwordField.value : "";
  if (!password) {
    setFieldError(passwordField, "Password is required.");
    firstInvalid = firstInvalid || passwordField;
  } else if (password.length < 8) {
    setFieldError(passwordField, "Password must be at least 8 characters.");
    firstInvalid = firstInvalid || passwordField;
  } else if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
    setFieldError(
      passwordField,
      "Password must contain at least 1 uppercase letter and 1 number."
    );
    firstInvalid = firstInvalid || passwordField;
  }

  // Confirm password validation
  const confirmPassword = confirmPasswordField
    ? confirmPasswordField.value
    : "";
  if (!confirmPassword) {
    setFieldError(confirmPasswordField, "Please confirm your password.");
    firstInvalid = firstInvalid || confirmPasswordField;
  } else if (password && password !== confirmPassword) {
    setFieldError(confirmPasswordField, "Passwords do not match.");
    firstInvalid = firstInvalid || confirmPasswordField;
  }

  // Role validation
  if (roleField && !roleField.value) {
    setFieldError(roleField, "Please choose a role.");
    firstInvalid = firstInvalid || roleField;
  }

  // Terms and conditions validation
  if (termsField && !termsField.checked) {
    setFieldError(
      termsField,
      "You must agree to the Terms of Use and Privacy Policy."
    );
    firstInvalid = firstInvalid || termsField;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
};

// Immediate input validation for first and last name (alphabets + spaces only)
const firstNameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const signupPhoneInput = document.querySelector("#signupPhone");

[firstNameInput, lastNameInput].forEach((field) => {
  if (!field) return;
  field.addEventListener("input", () => {
    const val = field.value;
    if (val && !/^[A-Za-z\s]*$/.test(val)) {
      setFieldError(field, "Only alphabets and spaces are allowed.");
    } else {
      clearFieldError(field);
    }
  });
});

// Immediate input validation for mobile number (only numbers allowed)
signupPhoneInput?.addEventListener("input", () => {
  const val = signupPhoneInput.value;
  if (val && /\D/.test(val)) {
    setFieldError(signupPhoneInput, "Mobile number must contain only numbers.");
  } else {
    clearFieldError(signupPhoneInput);
  }
});

// Real-time error clearing when user edits any field
document
  .querySelectorAll(".auth-form input, .auth-form select")
  .forEach((field) => {
    if (
      field === firstNameInput ||
      field === lastNameInput ||
      field === signupPhoneInput
    )
      return;
    field.addEventListener("input", () => {
      clearFieldError(field);
      if (authStatus) {
        authStatus.textContent = "";
        authStatus.className = "form-status";
      }
    });
    field.addEventListener("change", () => {
      clearFieldError(field);
      if (authStatus) {
        authStatus.textContent = "";
        authStatus.className = "form-status";
      }
    });
  });

// Handle sign-in form submit
signInForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateSignIn()) return;

  const email = document.querySelector("#loginEmail").value.trim();
  const role = document.querySelector("#loginRole").value;
  window.StacklySession.saveSession({ name: email.split("@")[0], email, role });

  authStatus.textContent = "Signed in. Opening your workspace...";
  authStatus.className = "form-status is-success";
  window.setTimeout(() => {
    const roleSlug = (role || "Admin").toLowerCase();
    window.location.href = `dashboard-${roleSlug}.html`;
  }, 350);
});

// Handle sign-up form submit
signUpForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateSignUp()) return;

  const firstName = document.querySelector("#firstName").value.trim();
  const lastName = document.querySelector("#lastName").value.trim();
  const email = document.querySelector("#signupEmail").value.trim();
  const role = document.querySelector("#signupRole").value;

  const users = JSON.parse(localStorage.getItem("stackly.users") || "[]");
  users.push({ firstName, lastName, email, role });
  localStorage.setItem("stackly.users", JSON.stringify(users));

  authStatus.textContent = "Account created. Redirecting to sign in...";
  authStatus.className = "form-status is-success";
  window.setTimeout(() => {
    window.location.href = "sign-in.html";
  }, 500);
});
