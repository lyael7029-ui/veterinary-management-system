let pacienteEditandoId = null;

let pacientesGlobal = [];

const API_URL = "http://localhost:3000/api/patients";
const patientsGrid = document.getElementById("patientsGrid");

document.addEventListener("DOMContentLoaded", obtenerPacientes);

async function obtenerPacientes() {
  try {
    const respuesta = await fetch(API_URL);
    const pacientes = await respuesta.json();

    pacientesGlobal = pacientes;

    patientsGrid.innerHTML = "";

    if (pacientes.length === 0) {
      patientsGrid.innerHTML = `
        <div class="col-span-full bg-white border border-outline-variant rounded-[20px] p-8 text-center">
          <p class="text-on-surface-variant font-body-base">
            No hay pacientes registrados todavía.
          </p>
        </div>
      `;
      return;
    }

    renderPacientes(pacientes);

  } catch (error) {
    console.error("Error al obtener pacientes:", error);

    patientsGrid.innerHTML = `
      <div class="col-span-full bg-error-container text-on-error-container rounded-xl p-6">
        Error al cargar los pacientes. Verifica que el backend esté encendido.
      </div>
    `;
  }
}

function renderPacientes(pacientes) {

  const container = patientsGrid;

  container.innerHTML = "";

  if (pacientes.length === 0) {

    container.innerHTML = `
      <div class="col-span-full p-6 bg-surface-container-low rounded-xl text-center">
        No se encontraron pacientes.
      </div>
    `;

    return;

  }

  pacientes.forEach((paciente) => {
  container.innerHTML += crearCardPaciente(paciente);
  
});
}

function crearCardPaciente(paciente) {
  return `
    <div 
  onclick="abrirExpediente(${paciente.id})"
  class="bg-white border border-outline-variant rounded-[20px] p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer">
      
      <div class="flex items-start justify-between mb-4">
        <div class="relative">
          <div class="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-4xl">pets</span>
          </div>

          <div class="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
        </div>

        <div class="bg-secondary-container/30 text-on-secondary-container px-3 py-1 rounded-full text-[11px] font-label-bold uppercase">
          ${paciente.status || "Estable"}
        </div>
      </div>

      <div class="mb-4">
        <h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
          ${paciente.name}
        </h3>

        <p class="text-on-surface-variant font-body-sm">
          ${paciente.breed || "Sin raza"} • ${paciente.age || "N/A"} años
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 border-t border-outline-variant/40 pt-4">
        <div>
          <p class="text-[10px] text-on-surface-variant uppercase tracking-widest font-label-bold mb-1">
            Dueño
          </p>
          <p class="font-body-sm font-bold">
            ${paciente.owner_name || "Sin dueño"}
          </p>
        </div>

        <div class="text-right">
          <p class="text-[10px] text-on-surface-variant uppercase tracking-widest font-label-bold mb-1">
            Peso
          </p>
          <p class="font-body-sm">
            ${paciente.weight || "N/A"} kg
          </p>
        </div>
      </div>

      <div class="flex gap-2 mt-5">
        <button 
          class="flex-1 py-2 rounded-lg bg-primary/10 text-primary font-label-bold text-label-bold hover:bg-primary/20"
    onclick="event.stopPropagation(); editarPaciente(${paciente.id})">
          Editar
        </button>

        <button 
          class="flex-1 py-2 rounded-lg bg-error-container text-on-error-container font-label-bold text-label-bold hover:opacity-80"
    onclick="event.stopPropagation(); eliminarPaciente(${paciente.id})">
          Eliminar
        </button>
      </div>
    </div>
    `
    ;
}

async function editarPaciente(id) {

  try {

    const respuesta = await fetch(API_URL);

    const pacientes = await respuesta.json();

    const paciente = pacientes.find(p => p.id === id);

    if (!paciente) return;

    pacienteEditandoId = id;

    formPaciente.owner_name.value = paciente.owner_name || "";
    formPaciente.phone.value = paciente.phone || "";
    formPaciente.email.value = paciente.email || "";
    formPaciente.address.value = paciente.address || "";

    formPaciente.name.value = paciente.name || "";
    formPaciente.species.value = paciente.species || "";
    formPaciente.breed.value = paciente.breed || "";

    formPaciente.age.value = paciente.age || "";

    formPaciente.weight.value = paciente.weight || "";

    formPaciente.gender.value = paciente.gender || "";

    formPaciente.allergies.value = paciente.allergies || "";

    formPaciente.status.value = paciente.status || "Estable";

    modalPaciente.classList.remove("hidden");

    modalPaciente.classList.add("flex");

  } catch (error) {

    console.error("Error al cargar paciente:", error);

  }

}

async function eliminarPaciente(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar este paciente?");

  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo eliminar el paciente");
    }

    obtenerPacientes();

  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    alert("Error al eliminar paciente");
  }
}

const modalPaciente = document.getElementById("modalPaciente");
const btnAbrirModalPaciente = document.getElementById("btnAbrirModalPaciente");
const btnCerrarModalPaciente = document.getElementById("btnCerrarModalPaciente");
const btnCancelarPaciente = document.getElementById("btnCancelarPaciente");
const formPaciente = document.getElementById("formPaciente");


btnAbrirModalPaciente.addEventListener("click", () => {
  modalPaciente.classList.remove("hidden");
  modalPaciente.classList.add("flex");
});

function cerrarModalPaciente() {
  modalPaciente.classList.add("hidden");
  modalPaciente.classList.remove("flex");
  formPaciente.reset();
  pacienteEditandoId = null;
}

btnCerrarModalPaciente.addEventListener("click", cerrarModalPaciente);
btnCancelarPaciente.addEventListener("click", cerrarModalPaciente);

formPaciente.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formPaciente));

  datos.age = datos.age ? Number(datos.age) : null;
  datos.weight = datos.weight ? Number(datos.weight) : null;

  try {
  const url = pacienteEditandoId
  ? `${API_URL}/${pacienteEditandoId}`
  : API_URL;

const respuesta = await fetch(url, {

  method: pacienteEditandoId ? "PUT" : "POST",

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify(datos)

});

    if (!respuesta.ok) {
      throw new Error("No se pudo guardar el paciente");
    }

    cerrarModalPaciente();
    obtenerPacientes();

  } catch (error) {
    console.error("Error al guardar paciente:", error);
    alert("Error al guardar paciente");
  }
});

function abrirExpediente(id) {
  window.location.href = `./expedientes.html?id=${id}`;
}

const searchInput = document.getElementById("searchPacientes");

searchInput.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();

  const filtrados = pacientesGlobal.filter(paciente => {
    return (
      paciente.name?.toLowerCase().includes(texto) ||
      paciente.breed?.toLowerCase().includes(texto) ||
      paciente.owner_name?.toLowerCase().includes(texto)
    );
  });

  renderPacientes(filtrados);
});

const btnAllPets = document.getElementById("btnAllPets");
const btnInClinic = document.getElementById("btnInClinic");
const btnUrgent = document.getElementById("btnUrgent");

function resetFiltros() {

  [btnAllPets, btnInClinic, btnUrgent]
    .forEach(btn => {

      btn.classList.remove(
        "bg-white",
        "shadow-sm",
        "text-primary",
        "font-bold"
      );

      btn.classList.add(
        "text-on-surface-variant"
      );

    });

}

btnAllPets.addEventListener("click", () => {

  resetFiltros();

  btnAllPets.classList.add(
    "bg-white",
    "shadow-sm",
    "text-primary",
    "font-bold"
  );

  renderPacientes(pacientesGlobal);

});

btnInClinic.addEventListener("click", () => {

  resetFiltros();

  btnInClinic.classList.add(
    "bg-white",
    "shadow-sm",
    "text-primary",
    "font-bold"
  );

  const filtrados =
    pacientesGlobal.filter(paciente =>
      paciente.status === "En tratamiento"
    );

  renderPacientes(filtrados);

});

btnUrgent.addEventListener("click", () => {

  resetFiltros();

  btnUrgent.classList.add(
    "bg-white",
    "shadow-sm",
    "text-primary",
    "font-bold"
  );

  const filtrados =
    pacientesGlobal.filter(paciente =>
      paciente.status === "Urgente"
    );

  renderPacientes(filtrados);

});