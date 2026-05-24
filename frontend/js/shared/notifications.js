// ===============================
// NOTIFICACIONES GLOBALES
// Se reutiliza en Dashboard, Pacientes, Expedientes y Citas
// ===============================

const API_PATIENTS_NOTIFY = "http://localhost:3000/api/patients";
const API_APPOINTMENTS_NOTIFY = "http://localhost:3000/api/appointments";
const API_VACCINES_NOTIFY = "http://localhost:3000/api/vaccines";

document.addEventListener("DOMContentLoaded", cargarNotificacionesGlobales);

async function cargarNotificacionesGlobales() {
  const btnNotificaciones = document.getElementById("btnNotificaciones");
  const dropdown = document.getElementById("dropdownNotificaciones");
  const lista = document.getElementById("listaNotificaciones");
  const badge = document.getElementById("notificacionBadge");

  if (!btnNotificaciones || !dropdown || !lista || !badge) return;

  btnNotificaciones.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  try {
    const [patientsRes, appointmentsRes, vaccinesRes] = await Promise.all([
      fetch(API_PATIENTS_NOTIFY),
      fetch(API_APPOINTMENTS_NOTIFY),
      fetch(API_VACCINES_NOTIFY)
    ]);

    const patients = await patientsRes.json();
    const appointments = await appointmentsRes.json();
    const vaccines = await vaccinesRes.json();

    const hoy = new Date().toLocaleDateString("sv-SE", {
      timeZone: "America/Mexico_City"
    });

    const citasHoy = appointments.filter(cita => {
      const fechaCita = new Date(cita.appointment_date).toLocaleDateString("sv-SE", {
        timeZone: "America/Mexico_City"
      });

      return fechaCita === hoy;
    }).length;

    const vacunasPendientes = vaccines.filter(vacuna => {
      const estado = (vacuna.status || "").toLowerCase();
      return estado === "pendiente" || estado === "vencida";
    }).length;

    const pacientesUrgentes = patients.filter(paciente =>
      paciente.status === "Urgente"
    ).length;

    renderNotificacionesGlobales({
      citasHoy,
      vacunasPendientes,
      pacientesUrgentes,
      lista,
      badge
    });

  } catch (error) {
    console.error("Error al cargar notificaciones:", error);
  }
}

function renderNotificacionesGlobales({
  citasHoy,
  vacunasPendientes,
  pacientesUrgentes,
  lista,
  badge
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

  lista.innerHTML = "";

  if (notificaciones.length === 0) {
    lista.innerHTML = `
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
    lista.innerHTML += `
      <div class="notification-item">
        <span class="material-symbols-outlined ${notificacion.color}">
          ${notificacion.icono}
        </span>

        <p>
          ${notificacion.texto}
        </p>
      </div>
    `;
  });
}