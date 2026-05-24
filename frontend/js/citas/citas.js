// ===============================
// INICIALIZADOR DEL MÓDULO CITAS
// Coordina calendario, agenda, próximas citas y modal
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  configurarModalCita();

  const citas = await obtenerCitas();

  inicializarCalendario(citas);
  renderAgendaHoy(citas);
  renderProximasCitas(citas);
});
