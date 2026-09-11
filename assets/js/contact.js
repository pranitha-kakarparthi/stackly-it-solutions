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
  return /^\d{10}$/.test(phone.trim());
};

// Immediate input validation for contact name (alphabets + spaces only)
const contactNameField = document.querySelector("#contactName");
contactNameField?.addEventListener("input", () => {
  const val = contactNameField.value;
  if (val && !/^[A-Za-z\s]*$/.test(val)) {
    setError(contactNameField, "Only alphabets and spaces are allowed.");
  } else {
    clearError(contactNameField);
  }
});

// Immediate input validation for contact mobile number (numbers only)
const contactPhoneField = document.querySelector("#contactPhone");
contactPhoneField?.addEventListener("input", () => {
  const val = contactPhoneField.value;
  if (val && /\D/.test(val)) {
    setError(contactPhoneField, "Mobile number must contain only numbers.");
  } else {
    clearError(contactPhoneField);
  }
});

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
  const name = nameField ? nameField.value.trim() : "";
  if (!name) {
    setError(nameField, "Name is required.");
    firstInvalid = firstInvalid || nameField;
  } else if (!/^[A-Za-z\s]+$/.test(name)) {
    setError(nameField, "Only alphabets and spaces are allowed.");
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

  // Mobile number validation (mandatory 10 digits)
  const phone = phoneField.value.trim();
  if (!phone) {
    setError(phoneField, "Mobile number is required.");
    firstInvalid = firstInvalid || phoneField;
  } else if (!isValidPhone(phone)) {
    setError(phoneField, "Please enter a valid 10-digit mobile number.");
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
  } else if (msg.length < 1) {
    setError(msgField, "Message must be at least 1 character.");
    firstInvalid = firstInvalid || msgField;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // Reset form and redirect to 404.html upon successful submission
  form.reset();
  updateCharCount();
  window.location.href = "../404.html";
});

// Live clear on input/change for other fields
form?.querySelectorAll("input, textarea, select").forEach((field) => {
  if (field === contactNameField || field === contactPhoneField) return;
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
