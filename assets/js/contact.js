const form = document.querySelector("#contactForm");
const status = document.querySelector("#contactStatus");

const clearContactErrors = () => {
  form?.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
  form?.querySelectorAll(".has-error").forEach((el) => {
    el.classList.remove("has-error");
  });
  if (status) status.textContent = "";
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearContactErrors();

  const required = [...form.querySelectorAll("[required]")];
  const invalid = required.find(
    (field) =>
      !field.value.trim() || (field.type === "email" && !field.validity.valid)
  );

  if (invalid) {
    const error = invalid.nextElementSibling?.classList.contains("field-error")
      ? invalid.nextElementSibling
      : invalid.closest(".form-group")?.querySelector(".field-error");
    if (error) {
      error.textContent =
        invalid.type === "email"
          ? "Enter a valid email address."
          : "This field is required.";
    }
    invalid.classList.add("has-error");
    invalid.focus();
    return;
  }

  status.textContent = "Thanks. Your enquiry is ready for the Stackly team.";
  form.reset();
});

form?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    const error = field.nextElementSibling?.classList.contains("field-error")
      ? field.nextElementSibling
      : field.closest(".form-group")?.querySelector(".field-error");
    if (error) error.textContent = "";
    field.classList.remove("has-error");
    if (status) status.textContent = "";
  });
});
