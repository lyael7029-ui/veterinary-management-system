// ===============================
// CONSULTAS DEL PACIENTE
// ===============================

let consultaEditandoId = null;

const consultasContainer = document.getElementById("consultasContainer");

const modalConsulta = document.getElementById("modalConsulta");
const btnNuevaConsulta = document.getElementById("btnNuevaConsulta");
const btnCerrarModalConsulta = document.getElementById("btnCerrarModalConsulta");
const btnCancelarConsulta = document.getElementById("btnCancelarConsulta");
const formConsulta = document.getElementById("formConsulta");
const btnEliminarConsulta = document.getElementById("btnEliminarConsulta");

function initConsultas() {
  btnNuevaConsulta.addEventListener("click", () => {
    consultaEditandoId = null;
    formConsulta.reset();
    btnEliminarConsulta.classList.add("hidden");

    modalConsulta.classList.remove("hidden");
    modalConsulta.classList.add("flex");
  });

  btnCerrarModalConsulta.addEventListener("click", cerrarModalConsulta);
  btnCancelarConsulta.addEventListener("click", cerrarModalConsulta);

  formConsulta.addEventListener("submit", guardarConsulta);

  btnEliminarConsulta.addEventListener("click", eliminarConsulta);
}

async function obtenerConsultas() {
  try {
    const response = await fetch(`${API_CONSULTATIONS}/patient/${patientId}`);
    const consultas = await response.json();

    consultasContainer.innerHTML = "";

    if (consultas.length === 0) {
      consultasContainer.innerHTML = `
        <div class="p-4 rounded-xl bg-surface-container-low text-center">
          No hay consultas registradas.
        </div>
      `;
      return;
    }

    consultas.forEach(consulta => {
      consultasContainer.innerHTML += `
        <div
          onclick="editarConsulta(${consulta.id})"
          class="p-4 border border-outline-variant rounded-xl bg-surface-container-low hover:shadow-sm transition-all cursor-pointer">

          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs text-primary font-bold uppercase tracking-wider">
                ${formatearFecha(consulta.consultation_date)}
              </p>

              <h3 class="font-headline-md text-lg text-on-surface">
                ${consulta.patient_name}
              </h3>
            </div>

            <div class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              ${consulta.breed || "Paciente"}
            </div>
          </div>

          <div class="space-y-2">
            <p><span class="font-bold">Diagnóstico:</span> ${consulta.diagnosis || "Sin diagnóstico"}</p>
            <p><span class="font-bold">Tratamiento:</span> ${consulta.treatment || "Sin tratamiento"}</p>
            <p><span class="font-bold">Notas:</span> ${consulta.notes || "Sin notas"}</p>

            <p class="text-sm text-on-surface-variant">
              Veterinario: ${consulta.veterinarian || "No registrado"}
            </p>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error al obtener consultas:", error);
  }
}

async function guardarConsulta(e) {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formConsulta));
  datos.patient_id = Number(patientId);

  const url = consultaEditandoId
    ? `${API_CONSULTATIONS}/${consultaEditandoId}`
    : API_CONSULTATIONS;

  try {
    const response = await fetch(url, {
      method: consultaEditandoId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar la consulta");
    }

    cerrarModalConsulta();
    obtenerConsultas();

  } catch (error) {
    console.error("Error al guardar consulta:", error);
    alert("Error al guardar consulta");
  }
}

async function editarConsulta(id) {
  try {
    const response = await fetch(`${API_CONSULTATIONS}/patient/${patientId}`);
    const consultas = await response.json();

    const consulta = consultas.find(c => c.id === id);
    if (!consulta) return;

    consultaEditandoId = id;

    formConsulta.diagnosis.value = consulta.diagnosis || "";
    formConsulta.treatment.value = consulta.treatment || "";
    formConsulta.notes.value = consulta.notes || "";
    formConsulta.veterinarian.value = consulta.veterinarian || "";

    btnEliminarConsulta.classList.remove("hidden");

    modalConsulta.classList.remove("hidden");
    modalConsulta.classList.add("flex");

  } catch (error) {
    console.error("Error al cargar consulta:", error);
  }
}

async function eliminarConsulta() {
  if (!consultaEditandoId) return;

  const confirmar = confirm("¿Seguro que deseas eliminar esta consulta?");
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_CONSULTATIONS}/${consultaEditandoId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar la consulta");
    }

    cerrarModalConsulta();
    obtenerConsultas();

  } catch (error) {
    console.error("Error al eliminar consulta:", error);
    alert("Error al eliminar consulta");
  }
}

function cerrarModalConsulta() {
  modalConsulta.classList.add("hidden");
  modalConsulta.classList.remove("flex");
  formConsulta.reset();
  consultaEditandoId = null;
}
