// ===============================
// PRÓXIMAS CITAS
// Renderiza las siguientes citas en la barra lateral
// ===============================

function obtenerProximasCitas(citas) {
  const inicioHoy = obtenerInicioHoy();

  return citas
    .filter((cita) => new Date(cita.appointment_date) >= inicioHoy)
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);
}

function renderProximasCitas(citas) {
  const contenedor = document.getElementById("proximasCitasSidebar");

  if (!contenedor) return;

  const proximas = obtenerProximasCitas(citas);

  contenedor.innerHTML = "";

  if (proximas.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-card">
        No hay próximas citas.
      </div>
    `;
    return;
  }

  proximas.forEach((cita) => {
    contenedor.innerHTML += `
      <div class="appointment-card">
        <p class="appointment-title">
          ${cita.patient_name || "Paciente sin nombre"}
        </p>

        <p class="appointment-text">
          ${cita.reason || "Sin motivo registrado"}
        </p>

        <p class="appointment-date">
          ${formatearFecha(cita.appointment_date)} · ${formatearHora(cita.appointment_date)}
        </p>
      </div>
    `;
  });
}
