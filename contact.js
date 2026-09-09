const form = document.querySelector("#contactForm");
const status = document.querySelector("#contactStatus");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const required = [...form.querySelectorAll("[required]")];
  const invalid = required.find(
    (field) =>
      !field.value.trim() || (field.type === "email" && !field.validity.valid),
  );
  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
  if (invalid) {
    invalid.nextElementSibling.textContent =
      invalid.type === "email"
        ? "Enter a valid email."
        : "This field is required.";
    invalid.focus();
    return;
  }
  status.textContent = "Thanks. Your enquiry is ready for the Stackly team.";
  form.reset();
});
