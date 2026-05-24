// ===============================
// INICIALIZACIÓN DE PACIENTES
// ===============================
// Este archivo conecta eventos y arranca la carga inicial.

document.addEventListener("DOMContentLoaded", async () => {
  await cargarPacientes();

  // Abrir modal para crear un paciente nuevo.
  btnAbrirModalPaciente.addEventListener("click", prepararFormularioNuevoPaciente);

  // Cerrar modal.
  btnCerrarModalPaciente.addEventListener("click", cerrarModalPaciente);
  btnCancelarPaciente.addEventListener("click", cerrarModalPaciente);

  // Guardar paciente nuevo o editado.
  formPaciente.addEventListener("submit", guardarPaciente);

  // Búsqueda dinámica.
  searchInput.addEventListener("input", actualizarVistaPacientes);

  // Filtro: todos los pacientes.
  btnAllPets.addEventListener("click", () => {
    filtroActivo = "todos";
    activarBotonFiltro(btnAllPets);
    actualizarVistaPacientes();
  });

  // Filtro: pacientes en tratamiento.
  btnInClinic.addEventListener("click", () => {
    filtroActivo = "en-tratamiento";
    activarBotonFiltro(btnInClinic);
    actualizarVistaPacientes();
  });

  // Filtro: pacientes urgentes.
  btnUrgent.addEventListener("click", () => {
    filtroActivo = "urgente";
    activarBotonFiltro(btnUrgent);
    actualizarVistaPacientes();
  });
});
