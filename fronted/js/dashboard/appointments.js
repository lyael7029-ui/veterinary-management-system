function obtenerProximasCitas(appointments) {
  const inicioHoy = obtenerInicioDeHoy();

  return appointments
    .filter(cita => new Date(cita.appointment_date) >= inicioHoy)
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);
}

function renderProximasCitas(proximasCitas) {
  const proximasCitasBody = document.getElementById("proximasCitasBody");

  if (!proximasCitasBody) return;

  proximasCitasBody.innerHTML = "";

  if (proximasCitas.length === 0) {
    proximasCitasBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-gutter py-4 text-center text-on-surface-variant">
          No hay próximas citas registradas.
        </td>
      </tr>
    `;
    return;
  }

  proximasCitas.forEach(cita => {
    proximasCitasBody.innerHTML += `
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-gutter py-4 font-label-bold text-on-surface">
          ${cita.patient_name || "Sin paciente"}
        </td>

        <td class="px-gutter py-4 font-body-sm text-on-surface-variant">
          ${cita.breed || "Sin raza"}
        </td>

        <td class="px-gutter py-4 font-body-sm text-on-surface">
          ${cita.owner_name || "Sin dueño"}
        </td>

        <td class="px-gutter py-4 font-body-sm font-bold text-primary">
          ${formatearHora(cita.appointment_date)}
        </td>

        <td class="px-gutter py-4">
          <span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-[10px] uppercase">
            ${cita.status || "Agendada"}
          </span>
        </td>

        <td class="px-gutter py-4 text-right">
          <a href="./expedientes.html?id=${cita.patient_id}" class="text-primary font-label-bold hover:underline">
            Ver
          </a>
        </td>
      </tr>
    `;
  });
}
