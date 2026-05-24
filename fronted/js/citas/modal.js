// ===============================
// MODAL DE CITAS
// Abre, cierra, carga pacientes y guarda cambios
// ===============================

const modalCita = document.getElementById("modalCita");
const btnAbrirModalCita = document.getElementById("btnAbrirModalCita");
const btnCerrarModalCita = document.getElementById("btnCerrarModalCita");
const btnCancelarCita = document.getElementById("btnCancelarCita");
const btnEliminarCita = document.getElementById("btnEliminarCita");
const formCita = document.getElementById("formCita");
const selectPaciente = document.getElementById("selectPaciente");
const mobileFab = document.querySelector(".mobile-fab");

async function cargarPacientesSelect() {
  const pacientes = await obtenerPacientes();

  selectPaciente.innerHTML = `
    <option value="">Selecciona un paciente</option>
  `;

  pacientes.forEach((paciente) => {
    selectPaciente.innerHTML += `
      <option value="${paciente.id}">
        ${paciente.name} — ${paciente.owner_name || "Sin dueño"}
      </option>
    `;
  });
}

async function abrirModalNuevaCita() {
  citaEditandoId = null;

  formCita.reset();
  btnEliminarCita.classList.add("hidden");

  await cargarPacientesSelect();

  modalCita.classList.remove("hidden");
  modalCita.classList.add("flex");
}

async function abrirModalEditarCita(evento) {
  citaEditandoId = evento.id;

  await cargarPacientesSelect();

  formCita.patient_id.value = evento.extendedProps.patient_id || "";
  formCita.appointment_date.value = convertirFechaParaInput(evento.start);
  formCita.reason.value = evento.extendedProps.reason || "";
  formCita.status.value = evento.extendedProps.status || "Agendada";
  formCita.notes.value = evento.extendedProps.notes || "";

  btnEliminarCita.classList.remove("hidden");

  modalCita.classList.remove("hidden");
  modalCita.classList.add("flex");
}

function cerrarModalCita() {
  modalCita.classList.add("hidden");
  modalCita.classList.remove("flex");

  formCita.reset();
  citaEditandoId = null;
}

function configurarModalCita() {
  btnAbrirModalCita.addEventListener("click", abrirModalNuevaCita);
  mobileFab?.addEventListener("click", abrirModalNuevaCita);

  btnCerrarModalCita.addEventListener("click", cerrarModalCita);
  btnCancelarCita.addEventListener("click", cerrarModalCita);

  formCita.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = Object.fromEntries(new FormData(formCita));

    try {
      await guardarCita(datos);
      cerrarModalCita();
      location.reload();
    } catch (error) {
      console.error("Error al guardar cita:", error);
      alert("Error al guardar cita");
    }
  });

  btnEliminarCita.addEventListener("click", async () => {
    if (!citaEditandoId) return;

    const confirmar = confirm("¿Seguro que deseas eliminar esta cita?");

    if (!confirmar) return;

    try {
      await eliminarCitaPorId(citaEditandoId);
      cerrarModalCita();
      location.reload();
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      alert("Error al eliminar cita");
    }
  });
}
