// ===============================
// VACUNAS DEL PACIENTE
// ===============================

let vacunaEditandoId = null;

const vacunasContainer = document.getElementById("vacunasContainer");

const modalVacuna = document.getElementById("modalVacuna");
const btnNuevaVacuna = document.getElementById("btnNuevaVacuna");
const btnCerrarModalVacuna = document.getElementById("btnCerrarModalVacuna");
const btnCancelarVacuna = document.getElementById("btnCancelarVacuna");
const btnEliminarVacuna = document.getElementById("btnEliminarVacuna");
const formVacuna = document.getElementById("formVacuna");

function initVacunas() {
  btnNuevaVacuna.addEventListener("click", () => {
    vacunaEditandoId = null;
    formVacuna.reset();
    btnEliminarVacuna.classList.add("hidden");

    modalVacuna.classList.remove("hidden");
    modalVacuna.classList.add("flex");
  });

  btnCerrarModalVacuna.addEventListener("click", cerrarModalVacuna);
  btnCancelarVacuna.addEventListener("click", cerrarModalVacuna);

  formVacuna.addEventListener("submit", guardarVacuna);

  btnEliminarVacuna.addEventListener("click", eliminarVacuna);
}

async function obtenerVacunas() {
  try {
    const response = await fetch(`${API_VACCINES}/patient/${patientId}`);
    const vacunas = await response.json();

    vacunasContainer.innerHTML = "";

    if (vacunas.length === 0) {
      vacunasContainer.innerHTML = `
        <div class="p-4 rounded-xl bg-surface-container-low text-center">
          No hay vacunas registradas.
        </div>
      `;
      return;
    }

    vacunas.forEach(vacuna => {
      vacunasContainer.innerHTML += `
        <div
          onclick="editarVacuna(${vacuna.id})"
          class="p-4 border border-outline-variant rounded-xl bg-surface-container-low hover:shadow-sm transition-all cursor-pointer">

          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="font-headline-md text-lg text-on-surface">
                ${vacuna.vaccine_name}
              </h3>

              <p class="text-sm text-on-surface-variant">
                ${vacuna.patient_name} ${vacuna.breed ? `— ${vacuna.breed}` : ""}
              </p>
            </div>

            <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              ${vacuna.status || "Aplicada"}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <p><span class="font-bold">Aplicación:</span> ${formatearFechaSimple(vacuna.application_date)}</p>
            <p><span class="font-bold">Próxima dosis:</span> ${formatearFechaSimple(vacuna.next_dose)}</p>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error al obtener vacunas:", error);
  }
}

async function guardarVacuna(e) {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formVacuna));
  datos.patient_id = Number(patientId);

  const url = vacunaEditandoId
    ? `${API_VACCINES}/${vacunaEditandoId}`
    : API_VACCINES;

  try {
    const response = await fetch(url, {
      method: vacunaEditandoId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar la vacuna");
    }

    cerrarModalVacuna();
    obtenerVacunas();

  } catch (error) {
    console.error("Error al guardar vacuna:", error);
    alert("Error al guardar vacuna");
  }
}

async function editarVacuna(id) {
  try {
    const response = await fetch(`${API_VACCINES}/patient/${patientId}`);
    const vacunas = await response.json();

    const vacuna = vacunas.find(v => v.id === id);
    if (!vacuna) return;

    vacunaEditandoId = id;

    formVacuna.vaccine_name.value = vacuna.vaccine_name || "";
    formVacuna.application_date.value = convertirFechaInput(vacuna.application_date);
    formVacuna.next_dose.value = convertirFechaInput(vacuna.next_dose);
    formVacuna.status.value = vacuna.status || "Aplicada";

    btnEliminarVacuna.classList.remove("hidden");

    modalVacuna.classList.remove("hidden");
    modalVacuna.classList.add("flex");

  } catch (error) {
    console.error("Error al editar vacuna:", error);
  }
}

async function eliminarVacuna() {
  if (!vacunaEditandoId) return;

  const confirmar = confirm("¿Seguro que deseas eliminar esta vacuna?");
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_VACCINES}/${vacunaEditandoId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar la vacuna");
    }

    cerrarModalVacuna();
    obtenerVacunas();

  } catch (error) {
    console.error("Error al eliminar vacuna:", error);
    alert("Error al eliminar vacuna");
  }
}

function cerrarModalVacuna() {
  modalVacuna.classList.add("hidden");
  modalVacuna.classList.remove("flex");
  formVacuna.reset();
  vacunaEditandoId = null;
}
