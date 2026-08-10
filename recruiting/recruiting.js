const form = document.querySelector("form");
const submitBtn = document.querySelector("button[type='submit']");
const discordBtn = document.querySelector(".discord a");
const messageBox = document.getElementById("generatedMessage");

// Fonction de validation des champs obligatoires
function validateForm() {
  const requiredFields = form.querySelectorAll("input[required], select[required]");
  const allFilled = Array.from(requiredFields).every(field => {
    if (field.type === "checkbox") return field.checked;
    return field.value.trim() !== "";
  });

  submitBtn.disabled = !allFilled;
  discordBtn.style.pointerEvents = allFilled ? "auto" : "none";
  discordBtn.style.opacity = allFilled ? "1" : "0.5";
}

form.addEventListener("input", validateForm);
window.addEventListener("load", validateForm);

// Génération automatique du message
form.addEventListener("submit", function (e) {
  const project = document.getElementById("project").value;
  const role = document.getElementById("role").value;
  const weeks = document.getElementById("duree").value;

  const secrecyChecked = document.getElementById("secrecy").checked;
  const presenceChecked = document.getElementById("presence").checked;

  if (!secrecyChecked || !presenceChecked) {
    alert("You must accept the conditions before submitting.");
    e.preventDefault();
    return;
  }

  const message = `Hello. I would be glad to join one of your projects, named [${project}], as a [${role}], for [${weeks}] weeks. I have understood that the projects' development must be kept secret and a constant work is required.`;
  messageBox.value = message;
});
