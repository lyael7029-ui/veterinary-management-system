// ===============================
// MODAL DE PACIENTES
// ===============================
// Este archivo controla abrir, cerrar y llenar el formulario del modal.

const modalPaciente = document.getElementById("modalPaciente");
const btnAbrirModalPaciente = document.getElementById("btnAbrirModalPaciente");
const btnCerrarModalPaciente = document.getElementById("btnCerrarModalPaciente");
const btnCancelarPaciente = document.getElementById("btnCancelarPaciente");
const formPaciente = document.getElementById("formPaciente");

function abrirModalPaciente() {
  modalPaciente.classList.remove("hidden");
  modalPaciente.classList.add("flex");
}

function cerrarModalPaciente() {
  modalPaciente.classList.add("hidden");
  modalPaciente.classList.remove("flex");
  formPaciente.reset();
  pacienteEditandoId = null;
}

function prepararFormularioNuevoPaciente() {
  pacienteEditandoId = null;
  formPaciente.reset();
  abrirModalPaciente();
}

function llenarFormularioPaciente(paciente) {
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
}
