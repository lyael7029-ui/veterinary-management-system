function calcularMetricas({ patients, appointments, consultations, vaccines }) {
  const hoy = new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Mexico_City"
  });

  const citasHoy = appointments.filter(cita => {
    return fechaISOEnMexico(cita.appointment_date) === hoy;
  });

  const vacunasPendientes = vaccines.filter(vacuna => {
    const estado = (vacuna.status || "").toLowerCase();
    return estado === "pendiente" || estado === "vencida";
  });

  const pacientesUrgentes = patients.filter(paciente => {
    return paciente.status === "Urgente";
  });

  return {
    totalPacientes: patients.length,
    totalConsultas: consultations.length,
    totalCitasHoy: citasHoy.length,
    totalVacunasPendientes: vacunasPendientes.length,
    totalPacientesUrgentes: pacientesUrgentes.length
  };
}

function renderMetricas(metricas) {
  document.getElementById("totalPacientes").textContent =
    metricas.totalPacientes;

  document.getElementById("totalConsultas").textContent =
    metricas.totalConsultas;

  document.getElementById("totalCitasHoy").textContent =
    metricas.totalCitasHoy;

  document.getElementById("totalVacunasPendientes").textContent =
    metricas.totalVacunasPendientes;
}
