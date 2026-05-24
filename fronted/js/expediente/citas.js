// ===============================
// CITAS DEL PACIENTE
// ===============================

let citaEditandoId = null;

const modalCita = document.getElementById("modalCita");
const btnNuevaCita = document.getElementById("btnNuevaCita");
const btnCerrarModalCita = document.getElementById("btnCerrarModalCita");
const btnCancelarCita = document.getElementById("btnCancelarCita");
const btnEliminarCita = document.getElementById("btnEliminarCita");
const formCita = document.getElementById("formCita");

function initCitas() {
  btnNuevaCita.addEventListener("click", () => {
    citaEditandoId = null;
    formCita.reset();
    btnEliminarCita.classList.add("hidden");

    modalCita.classList.remove("hidden");
    modalCita.classList.add("flex");
  });

  btnCerrarModalCita.addEventListener("click", cerrarModalCita);
  btnCancelarCita.addEventListener("click", cerrarModalCita);

  formCita.addEventListener("submit", guardarCita);

  btnEliminarCita.addEventListener("click", eliminarCita);
}

async function obtenerCitas() {
  try {
    const response = await fetch(`${API_APPOINTMENTS}/patient/${patientId}`);
    const citas = await response.json();

    const citasContainer = document.getElementById("citasContainer");
    citasContainer.innerHTML = "";

    if (citas.length === 0) {
      citasContainer.innerHTML = `
        <div class="p-4 rounded-xl bg-surface-container-low text-center">
          No hay citas agendadas para este paciente.
        </div>
      `;
      return;
    }

    citas.forEach(cita => {
      citasContainer.innerHTML += `
        <div
          onclick="editarCita(${cita.id})"
          class="p-4 border border-outline-variant rounded-xl bg-surface-container-low hover:shadow-sm transition-all cursor-pointer">

          <div class="flex justify-between items-center mb-2">
            <h3 class="font-headline-md text-lg text-on-surface">
              ${cita.reason || "Cita veterinaria"}
            </h3>

            <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              ${cita.status || "Agendada"}
            </span>
          </div>

          <p class="text-sm text-on-surface-variant">
            <strong>Fecha:</strong> ${formatearFechaSimple(cita.appointment_date)}
          </p>

          <p class="text-sm text-on-surface-variant">
            <strong>Notas:</strong> ${cita.notes || "Sin notas"}
          </p>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error al obtener citas:", error);
  }
}

async function guardarCita(e) {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formCita));
  datos.patient_id = Number(patientId);

  const url = citaEditandoId
    ? `${API_APPOINTMENTS}/${citaEditandoId}`
    : API_APPOINTMENTS;

  try {
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
    obtenerCitas();

  } catch (error) {
    console.error("Error al guardar cita:", error);
    alert("Error al guardar cita");
  }
}

async function editarCita(id) {
  try {
    const response = await fetch(`${API_APPOINTMENTS}/patient/${patientId}`);
    const citas = await response.json();

    const cita = citas.find(c => c.id === id);
    if (!cita) return;

    citaEditandoId = id;

    formCita.appointment_date.value = convertirFechaHoraInput(cita.appointment_date);
    formCita.reason.value = cita.reason || "";
    formCita.status.value = cita.status || "Agendada";
    formCita.notes.value = cita.notes || "";

    btnEliminarCita.classList.remove("hidden");

    modalCita.classList.remove("hidden");
    modalCita.classList.add("flex");

  } catch (error) {
    console.error("Error al editar cita:", error);
  }
}

async function eliminarCita() {
  if (!citaEditandoId) return;

  const confirmar = confirm("¿Seguro que deseas eliminar esta cita?");
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_APPOINTMENTS}/${citaEditandoId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar la cita");
    }

    cerrarModalCita();
    obtenerCitas();

  } catch (error) {
    console.error("Error al eliminar cita:", error);
    alert("Error al eliminar cita");
  }
}

function cerrarModalCita() {
  modalCita.classList.add("hidden");
  modalCita.classList.remove("flex");
  formCita.reset();
  citaEditandoId = null;
}
