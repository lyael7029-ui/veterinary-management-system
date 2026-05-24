const API_APPOINTMENTS = "http://localhost:3000/api/appointments";

let citaEditandoId = null;

document.addEventListener("DOMContentLoaded", async function () {

  const calendarEl = document.getElementById("calendar");

  const citas = await obtenerCitas();

const eventos = citas.map(cita => ({

  id: cita.id,

  title: `${cita.patient_name} - ${cita.reason}`,

  start: cita.appointment_date,

  extendedProps: {

    patient_id: cita.patient_id,

    reason: cita.reason,

    owner: cita.owner_name,

    breed: cita.breed,

    notes: cita.notes,

    status: cita.status

  },

  color: obtenerColorEstado(cita.status)

}));

  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",

    locale: "es",

    height: "auto",

    events: eventos,

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },

    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día"
    },

    
   eventClick: async function(info) {

  const cita = info.event;

  citaEditandoId = cita.id;

  await cargarPacientes();

  formCita.patient_id.value = cita.extendedProps.patient_id || "";

  formCita.appointment_date.value =
    cita.startStr.slice(0, 16);

  formCita.reason.value =
    cita.extendedProps.reason || "";

  formCita.status.value =
    cita.extendedProps.status || "Agendada";

  formCita.notes.value =
    cita.extendedProps.notes || "";

    btnEliminarCita.classList.remove("hidden");

  modalCita.classList.remove("hidden");

  modalCita.classList.add("flex");

}

  });

  calendar.render();

  renderProximasCitas(citas);

});

async function obtenerCitas() {

  try {

    const response = await fetch(API_APPOINTMENTS);

    return await response.json();

  } catch (error) {

    console.error("Error al obtener citas:", error);

    return [];

  }

}

function obtenerColorEstado(status) {

  switch(status?.toLowerCase()) {

    case "agendada":
      return "#2563eb";

    case "completada":
      return "#16a34a";

    case "cancelada":
      return "#dc2626";

    default:
      return "#f59e0b";

  }

}

const API_PATIENTS = "http://localhost:3000/api/patients";

const modalCita = document.getElementById("modalCita");

const btnAbrirModalCita = document.getElementById("btnAbrirModalCita");

const btnCerrarModalCita = document.getElementById("btnCerrarModalCita");

const btnCancelarCita = document.getElementById("btnCancelarCita");

const btnEliminarCita = document.getElementById("btnEliminarCita");

const formCita = document.getElementById("formCita");

const selectPaciente = document.getElementById("selectPaciente");

btnAbrirModalCita.addEventListener("click", async () => {

  await cargarPacientes();

  btnEliminarCita.classList.add("hidden");

  modalCita.classList.remove("hidden");

  modalCita.classList.add("flex");

});

function cerrarModalCita() {

  modalCita.classList.add("hidden");

  modalCita.classList.remove("flex");

  formCita.reset();

  citaEditandoId = null;

}

btnCerrarModalCita.addEventListener("click", cerrarModalCita);

btnCancelarCita.addEventListener("click", cerrarModalCita);

async function cargarPacientes() {

  try {

    const response = await fetch(API_PATIENTS);

    const pacientes = await response.json();

    selectPaciente.innerHTML = `
      <option value="">Selecciona un paciente</option>
    `;

    pacientes.forEach(paciente => {

      selectPaciente.innerHTML += `
        <option value="${paciente.id}">
          ${paciente.name} — ${paciente.owner_name}
        </option>
      `;

    });

  } catch (error) {

    console.error("Error al cargar pacientes:", error);

  }

}

formCita.addEventListener("submit", async (e) => {

  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formCita));

  try {

    const url = citaEditandoId
  ? `${API_APPOINTMENTS}/${citaEditandoId}`
  : API_APPOINTMENTS;

const response = await fetch(url, {

  method: citaEditandoId ? "PUT" : "POST",

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify(datos)

});

    if (!response.ok) {

      throw new Error("No se pudo guardar la cita");

    }

    cerrarModalCita();

    location.reload();

  } catch (error) {

    console.error("Error al guardar cita:", error);

    alert("Error al guardar cita");

  }

});

const agendaHoy = document.getElementById("agendaHoy");
const contadorAgenda = document.getElementById("contadorAgenda");

async function cargarAgendaHoy() {
  try {
    const response = await fetch(API_APPOINTMENTS);
    const citas = await response.json();

    const hoy = new Date().toLocaleDateString("sv-SE", {
  timeZone: "America/Mexico_City"
});

const citasHoy = citas.filter(cita => {
  const fechaCita = new Date(cita.appointment_date).toLocaleDateString("sv-SE", {
    timeZone: "America/Mexico_City"
  });

  return fechaCita === hoy;
});

    contadorAgenda.textContent = `${citasHoy.length} citas`;

    agendaHoy.innerHTML = "";

    if (citasHoy.length === 0) {
      agendaHoy.innerHTML = `
        <div class="p-4 bg-surface-container-low rounded-xl text-center">
          <p class="text-body-sm text-on-surface-variant">
            No hay citas agendadas para hoy.
          </p>
        </div>
      `;
      return;
    }

    citasHoy.forEach(cita => {
      const fecha = new Date(cita.appointment_date);

      const hora = fecha.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit"
      });

      agendaHoy.innerHTML += `
        <div class="flex gap-3 group">
          <div class="text-center min-w-[50px]">
            <p class="text-label-bold font-label-bold text-on-surface">${hora}</p>
          </div>

          <div class="flex-1 p-3 bg-surface-container-low rounded-lg border-l-4 border-primary hover:shadow-sm transition-shadow">
            <div class="flex items-center justify-between mb-1">
              <h4 class="font-label-bold text-label-bold text-on-surface">
                ${cita.patient_name} ${cita.breed ? `(${cita.breed})` : ""}
              </h4>

              <span class="material-symbols-outlined text-primary text-sm">
                event
              </span>
            </div>

            <p class="text-[11px] text-on-surface-variant">
              ${cita.reason || "Sin motivo registrado"}
            </p>

            <p class="text-[10px] text-on-surface-variant mt-1">
              Estado: ${cita.status || "Agendada"}
            </p>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error al cargar agenda de hoy:", error);
  }
}

cargarAgendaHoy();

btnEliminarCita.addEventListener("click", async () => {

  if (!citaEditandoId) return;

  const confirmar = confirm(
    "¿Seguro que deseas eliminar esta cita?"
  );

  if (!confirmar) return;

  try {

    const response = await fetch(

      `${API_APPOINTMENTS}/${citaEditandoId}`,

      {
        method: "DELETE"
      }

    );

    if (!response.ok) {

      throw new Error("No se pudo eliminar");

    }

    cerrarModalCita();

    location.reload();

  } catch (error) {

    console.error("Error al eliminar cita:", error);

    alert("Error al eliminar cita");

  }

});

function renderProximasCitas(citas) {
  const contenedor = document.getElementById("proximasCitasSidebar");

  if (!contenedor) return;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const proximas = citas
    .filter(cita => new Date(cita.appointment_date) >= hoy)
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);

  contenedor.innerHTML = "";

  if (proximas.length === 0) {
    contenedor.innerHTML = `
      <div class="p-4 bg-surface-container-low rounded-xl text-center">
        <p class="text-body-sm text-on-surface-variant">
          No hay próximas citas.
        </p>
      </div>
    `;
    return;
  }

  proximas.forEach(cita => {
    contenedor.innerHTML += `
      <div class="p-3 bg-surface-container-low rounded-lg border-l-4 border-primary">
        <p class="font-label-bold text-on-surface">
          ${cita.patient_name || "Paciente sin nombre"}
        </p>

        <p class="text-[11px] text-on-surface-variant">
          ${cita.reason || "Sin motivo registrado"}
        </p>

        <p class="text-[10px] text-primary font-bold mt-1">
          ${new Date(cita.appointment_date).toLocaleDateString("es-MX")} ·
          ${new Date(cita.appointment_date).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </div>
    `;
  });
}