const API_PATIENTS_DASH = "http://localhost:3000/api/patients";
const API_APPOINTMENTS_DASH = "http://localhost:3000/api/appointments";
const API_CONSULTATIONS_DASH = "http://localhost:3000/api/consultations";
const API_VACCINES_DASH = "http://localhost:3000/api/vaccines";

document.addEventListener("DOMContentLoaded", cargarDashboard);

async function cargarDashboard() {
  try {

    document.getElementById("fechaActual").textContent =
  new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  
    const [patientsRes, appointmentsRes, consultationsRes, vaccinesRes] =
      await Promise.all([
        fetch(API_PATIENTS_DASH),
        fetch(API_APPOINTMENTS_DASH),
        fetch(API_CONSULTATIONS_DASH),
        fetch(API_VACCINES_DASH)
      ]);

    const patients = await patientsRes.json();
    const appointments = await appointmentsRes.json();
    const consultations = await consultationsRes.json();
    const vaccines = await vaccinesRes.json();

    document.getElementById("totalPacientes").textContent = patients.length;
    document.getElementById("totalConsultas").textContent = consultations.length;

    const hoy = new Date().toLocaleDateString("sv-SE", {
      timeZone: "America/Mexico_City"
    });

    const citasHoy = appointments.filter(cita => {
      const fechaCita = new Date(cita.appointment_date).toLocaleDateString("sv-SE", {
        timeZone: "America/Mexico_City"
      });

      return fechaCita === hoy;
    });

    document.getElementById("totalCitasHoy").textContent = citasHoy.length;

    const vacunasPendientes = vaccines.filter(vacuna => {
      const estado = (vacuna.status || "").toLowerCase();
      return estado === "pendiente" || estado === "vencida";
    });

    document.getElementById("totalVacunasPendientes").textContent =
      vacunasPendientes.length;

      const pacientesUrgentes =
  patients.filter(paciente =>
    paciente.status === "Urgente"
  ).length;

renderNotificaciones({
  citasHoy: citasHoy.length,
  vacunasPendientes: vacunasPendientes.length,
  pacientesUrgentes
});

    const proximasCitas = appointments
  .filter(cita => new Date(cita.appointment_date) >= new Date())
  .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
  .slice(0, 5);

const proximasCitasBody = document.getElementById("proximasCitasBody");

proximasCitasBody.innerHTML = "";

if (proximasCitas.length === 0) {
  proximasCitasBody.innerHTML = `
    <tr>
      <td colspan="6" class="px-gutter py-4 text-center text-on-surface-variant">
        No hay próximas citas registradas.
      </td>
    </tr>
  `;
} else {
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

renderSchedule(proximasCitas);

  } catch (error) {
    console.error("Error al cargar dashboard:", error);
  }
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City"
  });
}

const btnNotificaciones =
  document.getElementById("btnNotificaciones");

const dropdownNotificaciones =
  document.getElementById("dropdownNotificaciones");

const listaNotificaciones =
  document.getElementById("listaNotificaciones");

const badge =
  document.getElementById("notificacionBadge");

btnNotificaciones.addEventListener("click", () => {

  dropdownNotificaciones.classList.toggle("hidden");

});

function renderNotificaciones({
  citasHoy,
  vacunasPendientes,
  pacientesUrgentes
}) {

  const notificaciones = [];

  if (citasHoy > 0) {

    notificaciones.push({
      icono: "calendar_month",
      color: "text-primary",
      texto: `${citasHoy} citas programadas para hoy`
    });

  }

  if (vacunasPendientes > 0) {

    notificaciones.push({
      icono: "vaccines",
      color: "text-tertiary",
      texto: `${vacunasPendientes} vacunas pendientes`
    });

  }

  if (pacientesUrgentes > 0) {

    notificaciones.push({
      icono: "warning",
      color: "text-error",
      texto: `${pacientesUrgentes} pacientes urgentes`
    });

  }

  listaNotificaciones.innerHTML = "";

  if (notificaciones.length === 0) {

    listaNotificaciones.innerHTML = `
      <div class="text-center py-6 text-on-surface-variant">
        No hay notificaciones.
      </div>
    `;

    badge.classList.add("hidden");

    return;

  }

  badge.classList.remove("hidden");

  badge.textContent = notificaciones.length;

  notificaciones.forEach(notificacion => {

    listaNotificaciones.innerHTML += `

      <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">

        <span class="material-symbols-outlined ${notificacion.color}">
          ${notificacion.icono}
        </span>

        <p class="text-sm text-on-surface">
          ${notificacion.texto}
        </p>

      </div>

    `;

  });

}