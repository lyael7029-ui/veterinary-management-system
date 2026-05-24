// ===============================
// RENDERIZADO DE PACIENTES
// ===============================
// Aquí vive todo lo relacionado con pintar tarjetas en pantalla.

const patientsGrid = document.getElementById("patientsGrid");

function renderPacientes(pacientes) {
  patientsGrid.innerHTML = "";

  if (pacientes.length === 0) {
    patientsGrid.innerHTML = `
      <div class="col-span-full p-6 bg-surface-container-low rounded-xl text-center">
        No se encontraron pacientes.
      </div>
    `;
    return;
  }

  pacientes.forEach((paciente) => {
    patientsGrid.innerHTML += crearCardPaciente(paciente);
  });
}

function renderErrorPacientes() {
  patientsGrid.innerHTML = `
    <div class="col-span-full bg-error-container text-on-error-container rounded-xl p-6">
      Error al cargar los pacientes. Verifica que el backend esté encendido.
    </div>
  `;
}

function renderSinPacientes() {
  patientsGrid.innerHTML = `
    <div class="col-span-full bg-white border border-outline-variant rounded-[20px] p-8 text-center">
      <p class="text-on-surface-variant font-body-base">
        No hay pacientes registrados todavía.
      </p>
    </div>
  `;
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
  `;
}
