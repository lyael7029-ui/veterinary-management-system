// ===============================
// AGENDA DE HOY
// Renderiza únicamente las citas del día actual
// ===============================

function obtenerCitasDeHoy(citas) {
  const hoy = new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Mexico_City"
  });

  return citas.filter((cita) => {
    const fechaCita = new Date(cita.appointment_date).toLocaleDateString("sv-SE", {
      timeZone: "America/Mexico_City"
    });

    return fechaCita === hoy;
  });
}

function renderAgendaHoy(citas) {
  const agendaHoy = document.getElementById("agendaHoy");
  const contadorAgenda = document.getElementById("contadorAgenda");

  const citasHoy = obtenerCitasDeHoy(citas);

  contadorAgenda.textContent = `${citasHoy.length} citas`;
  agendaHoy.innerHTML = "";

  if (citasHoy.length === 0) {
    agendaHoy.innerHTML = `
      <div class="empty-card">
        No hay citas agendadas para hoy.
      </div>
    `;
    return;
  }

  citasHoy.forEach((cita) => {
    agendaHoy.innerHTML += `
      <div class="appointment-row">
        <div class="appointment-time">
          ${formatearHora(cita.appointment_date)}
        </div>

        <div class="appointment-card">
          <p class="appointment-title">
            ${cita.patient_name || "Paciente sin nombre"}
            ${cita.breed ? `(${cita.breed})` : ""}
          </p>

          <p class="appointment-text">
            ${cita.reason || "Sin motivo registrado"}
          </p>

          <p class="appointment-text">
            Estado: ${cita.status || "Agendada"}
          </p>
        </div>
      </div>
    `;
  });
}
