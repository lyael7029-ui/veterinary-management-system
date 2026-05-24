const btnNotificaciones =
  document.getElementById("btnNotificaciones");

const dropdownNotificaciones =
  document.getElementById("dropdownNotificaciones");

const listaNotificaciones =
  document.getElementById("listaNotificaciones");

const badge =
  document.getElementById("notificacionBadge");

function inicializarNotificaciones() {
  if (!btnNotificaciones || !dropdownNotificaciones) return;

  btnNotificaciones.addEventListener("click", () => {
    dropdownNotificaciones.classList.toggle("hidden");
  });
}

function renderNotificaciones({
  citasHoy,
  vacunasPendientes,
  pacientesUrgentes
}) {
  if (!listaNotificaciones || !badge) return;

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
