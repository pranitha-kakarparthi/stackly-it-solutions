const form = document.querySelector("#contactForm");
const status = document.querySelector("#contactStatus");
const messageInput = document.querySelector("#contactMessage");
const charCount = document.querySelector("#charCount");
const charCounter = document.querySelector(".char-counter");

// Update character count in real time
const updateCharCount = () => {
  if (!messageInput || !charCount) return;
  const count = messageInput.value.length;
  charCount.textContent = String(count);

  if (charCounter) {
    charCounter.classList.toggle("is-warning", count >= 450 && count < 500);
    charCounter.classList.toggle("is-max", count >= 500);
  }
};

messageInput?.addEventListener("input", updateCharCount);

// Validation helper functions
const getFieldError = (field) => {
  const group = field.closest(".form-group") || field.parentElement;
  return group ? group.querySelector(".field-error") : null;
};

const setError = (field, message) => {
  const error = getFieldError(field);
  if (error) error.textContent = message;
  field.classList.add("has-error");
};

const clearError = (field) => {
  const error = getFieldError(field);
  if (error) error.textContent = "";
  field.classList.remove("has-error");
};

const clearAllErrors = () => {
  form?.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
  form?.querySelectorAll(".has-error").forEach((el) => {
    el.classList.remove("has-error");
  });
  if (status) {
    status.textContent = "";
    status.className = "form-status";
  }
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return (
    digits.length >= 7 &&
    digits.length <= 15 &&
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(phone)
  );
};

// Form submission validation
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearAllErrors();

  const nameField = document.querySelector("#contactName");
  const emailField = document.querySelector("#contactEmail");
  const phoneField = document.querySelector("#contactPhone");
  const subjectField = document.querySelector("#contactSubject");
  const msgField = document.querySelector("#contactMessage");

  let firstInvalid = null;

  // Name validation
  if (!nameField.value.trim()) {
    setError(nameField, "Name is required.");
    firstInvalid = firstInvalid || nameField;
  }

  // Email validation
  const email = emailField.value.trim();
  if (!email) {
    setError(emailField, "Email address is required.");
    firstInvalid = firstInvalid || emailField;
  } else if (!isValidEmail(email)) {
    setError(emailField, "Please enter a valid email address.");
    firstInvalid = firstInvalid || emailField;
  }

  // Mobile number validation (mandatory)
  const phone = phoneField.value.trim();
  if (!phone) {
    setError(phoneField, "Mobile number is required.");
    firstInvalid = firstInvalid || phoneField;
  } else if (!isValidPhone(phone)) {
    setError(phoneField, "Please enter a valid phone number (min 7 digits).");
    firstInvalid = firstInvalid || phoneField;
  }

  // Subject validation
  if (!subjectField.value.trim()) {
    setError(subjectField, "Subject is required.");
    firstInvalid = firstInvalid || subjectField;
  }

  // Message validation
  const msg = msgField.value.trim();
  if (!msg) {
    setError(msgField, "Message is required.");
    firstInvalid = firstInvalid || msgField;
  } else if (msg.length < 10) {
    setError(msgField, "Message must be at least 10 characters.");
    firstInvalid = firstInvalid || msgField;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // Success state
  if (status) {
    status.textContent =
      "Thank you! Your enquiry has been received. We will get back to you shortly.";
    status.className = "form-status is-success";
  }
  form.reset();
  updateCharCount();
});

// Live clear on input/change
form?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    clearError(field);
    if (status && !status.classList.contains("is-success")) {
      status.textContent = "";
      status.className = "form-status";
    }
  });
  field.addEventListener("change", () => {
    clearError(field);
  });
});
