let consultaEditandoId = null;

let citaEditandoId = null;

let vacunaEditandoId = null;

const API_CONSULTATIONS ="http://localhost:3000/api/consultations";

const API_VACCINES = "http://localhost:3000/api/vaccines";

const API_APPOINTMENTS = "http://localhost:3000/api/appointments";

const API_PATIENTS = "http://localhost:3000/api/patients";

const params = new URLSearchParams(window.location.search);

const patientId = params.get("id");

async function cargarPaciente() {

  try {

    const response =
      await fetch(`${API_PATIENTS}/${patientId}`);

    const paciente =
      await response.json();

    document.getElementById("nombrePaciente").textContent =
      paciente.name || "Sin nombre";

    document.getElementById("razaPaciente").textContent =
      paciente.breed || "Sin raza";

    document.getElementById("edadGeneroPaciente").textContent =
      `${paciente.age || "N/A"} años (${paciente.gender || "N/A"})`;

    document.getElementById("pesoPaciente").textContent =
      `${paciente.weight || "N/A"} kg`;

    document.getElementById("estadoPaciente").textContent =
      paciente.status || "Sin estado";

  } catch (error) {

    console.error(
      "Error al cargar paciente:",
      error
    );

  }

}


const consultasContainer =
  document.getElementById("consultasContainer");


document.addEventListener("DOMContentLoaded", () => {

  cargarPaciente();

  obtenerConsultas();

  obtenerVacunas();

  obtenerCitas();

});

async function obtenerConsultas() {

  try {

    const response =
      await fetch(`${API_CONSULTATIONS}/patient/${patientId}`)

    const consultas =
      await response.json();

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

<div onclick="editarConsulta(${consulta.id})"
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

            <p>
              <span class="font-bold">
                Diagnóstico:
              </span>

              ${consulta.diagnosis || "Sin diagnóstico"}
            </p>

            <p>
              <span class="font-bold">
                Tratamiento:
              </span>

              ${consulta.treatment || "Sin tratamiento"}
            </p>

            <p>
              <span class="font-bold">
                Notas:
              </span>

              ${consulta.notes || "Sin notas"}
            </p>

            <p class="text-sm text-on-surface-variant">
              Veterinario:
              ${consulta.veterinarian || "No registrado"}
            </p>

          </div>

        </div>

      `;

    });

  } catch (error) {

    console.error(
      "Error al obtener consultas:",
      error
    );

  }

}

function formatearFecha(fecha) {

  return new Date(fecha).toLocaleDateString(
    "es-MX",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );

}


const modalConsulta = document.getElementById("modalConsulta");
const btnNuevaConsulta = document.getElementById("btnNuevaConsulta");
const btnCerrarModalConsulta = document.getElementById("btnCerrarModalConsulta");
const btnCancelarConsulta = document.getElementById("btnCancelarConsulta");
const formConsulta = document.getElementById("formConsulta");
const btnEliminarConsulta = document.getElementById("btnEliminarConsulta");
const selectPacienteConsulta = document.getElementById("selectPacienteConsulta");

btnNuevaConsulta.addEventListener("click", async () => {
  consultaEditandoId = null;

  btnEliminarConsulta.classList.add("hidden");

  modalConsulta.classList.remove("hidden");
  modalConsulta.classList.add("flex");
});

function cerrarModalConsulta() {
  modalConsulta.classList.add("hidden");
  modalConsulta.classList.remove("flex");
  formConsulta.reset();
  consultaEditandoId = null;
}

btnCerrarModalConsulta.addEventListener("click", cerrarModalConsulta);
btnCancelarConsulta.addEventListener("click", cerrarModalConsulta);

async function cargarPacientesConsulta() {
  const response = await fetch(API_PATIENTS);
  const pacientes = await response.json();

  selectPacienteConsulta.innerHTML = `
    <option value="">Selecciona un paciente</option>
  `;

  pacientes.forEach(paciente => {
    selectPacienteConsulta.innerHTML += `
      <option value="${paciente.id}">
        ${paciente.name} — ${paciente.owner_name || "Sin dueño"}
      </option>
    `;
  });
}

formConsulta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formConsulta));

  datos.patient_id = patientId;

  try {
   const url = consultaEditandoId
  ? `${API_CONSULTATIONS}/${consultaEditandoId}`
  : API_CONSULTATIONS;

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
});

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

btnEliminarConsulta.addEventListener("click", async () => {
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
});


const vacunasContainer = document.getElementById("vacunasContainer");

const modalVacuna = document.getElementById("modalVacuna");
const btnNuevaVacuna = document.getElementById("btnNuevaVacuna");
const btnCerrarModalVacuna = document.getElementById("btnCerrarModalVacuna");
const btnCancelarVacuna = document.getElementById("btnCancelarVacuna");
const btnEliminarVacuna = document.getElementById("btnEliminarVacuna");
const formVacuna = document.getElementById("formVacuna");
const selectPacienteVacuna = document.getElementById("selectPacienteVacuna");
const modalCita = document.getElementById("modalCita");
const btnNuevaCita = document.getElementById("btnNuevaCita");
const btnCerrarModalCita = document.getElementById("btnCerrarModalCita");
const btnCancelarCita = document.getElementById("btnCancelarCita");
const formCita = document.getElementById("formCita");
const btnEliminarCita = document.getElementById("btnEliminarCita");



formCita.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formCita));
  datos.patient_id = patientId;

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
});


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

btnEliminarCita.addEventListener("click", async () => {
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
});

function convertirFechaHoraInput(fecha) {
  if (!fecha) return "";

  return new Date(fecha).toISOString().slice(0, 16);
}

btnNuevaCita.addEventListener("click", () => {
  citaEditandoId = null;
  formCita.reset();
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

async function obtenerVacunas() {
  try {
    const response = await fetch(`${API_VACCINES}/patient/${patientId}`)
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
            <p>
              <span class="font-bold">Aplicación:</span>
              ${formatearFechaSimple(vacuna.application_date)}
            </p>

            <p>
              <span class="font-bold">Próxima dosis:</span>
              ${formatearFechaSimple(vacuna.next_dose)}
            </p>
          </div>

        </div>
      `;
    });

  } catch (error) {
    console.error("Error al obtener vacunas:", error);
  }
}


btnNuevaVacuna.addEventListener("click", async () => {
  vacunaEditandoId = null;

  btnEliminarVacuna.classList.add("hidden");

  modalVacuna.classList.remove("hidden");
  modalVacuna.classList.add("flex");
});

function cerrarModalVacuna() {
  modalVacuna.classList.add("hidden");
  modalVacuna.classList.remove("flex");
  formVacuna.reset();
  vacunaEditandoId = null;
}

btnCerrarModalVacuna.addEventListener("click", cerrarModalVacuna);
btnCancelarVacuna.addEventListener("click", cerrarModalVacuna);

async function cargarPacientesVacuna() {
  const response = await fetch(API_PATIENTS);
  const pacientes = await response.json();

  selectPacienteVacuna.innerHTML = `
    <option value="">Selecciona un paciente</option>
  `;

  pacientes.forEach(paciente => {
    selectPacienteVacuna.innerHTML += `
      <option value="${paciente.id}">
        ${paciente.name} — ${paciente.owner_name || "Sin dueño"}
      </option>
    `;
  });
}

formVacuna.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formVacuna));

  datos.patient_id = patientId;

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
});

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

btnEliminarVacuna.addEventListener("click", async () => {
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
});

function formatearFechaSimple(fecha) {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function convertirFechaInput(fecha) {
  if (!fecha) return "";

  return new Date(fecha).toISOString().slice(0, 10);
}