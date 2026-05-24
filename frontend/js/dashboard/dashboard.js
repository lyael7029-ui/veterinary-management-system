document.addEventListener("DOMContentLoaded", () => {
  inicializarNotificaciones();
  cargarDashboard();
});

async function cargarDashboard() {
  try {
    setFechaActual();

    const [
      patientsRes,
      appointmentsRes,
      consultationsRes,
      vaccinesRes
    ] = await Promise.all([
      fetch(API_PATIENTS_DASH),
      fetch(API_APPOINTMENTS_DASH),
      fetch(API_CONSULTATIONS_DASH),
      fetch(API_VACCINES_DASH)
    ]);

    const patients = await patientsRes.json();
    const appointments = await appointmentsRes.json();
    const consultations = await consultationsRes.json();
    const vaccines = await vaccinesRes.json();

    const metricas = calcularMetricas({
      patients,
      appointments,
      consultations,
      vaccines
    });

    renderMetricas(metricas);

    renderNotificaciones({
      citasHoy: metricas.totalCitasHoy,
      vacunasPendientes: metricas.totalVacunasPendientes,
      pacientesUrgentes: metricas.totalPacientesUrgentes
    });

    const proximasCitas = obtenerProximasCitas(appointments);
    renderProximasCitas(proximasCitas);

  } catch (error) {
    console.error("Error al cargar dashboard:", error);
  }
}
