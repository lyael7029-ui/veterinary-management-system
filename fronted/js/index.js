// ===============================
// LOGIN DEMOSTRATIVO
// Redirige al dashboard sin autenticación real
// ===============================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // En esta versión académica no validamos usuarios reales.
  // Más adelante se puede reemplazar por JWT/sesiones con backend.
  window.location.href = "./dashboard.html";
});
