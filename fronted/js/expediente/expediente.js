// ===============================
// INICIALIZADOR DEL EXPEDIENTE
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  cargarPaciente();

  initConsultas();
  initVacunas();
  initCitas();

  obtenerConsultas();
  obtenerVacunas();
  obtenerCitas();
});
