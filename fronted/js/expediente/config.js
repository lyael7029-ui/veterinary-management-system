// ===============================
// CONFIGURACIÓN GLOBAL DEL EXPEDIENTE
// ===============================

const API_CONSULTATIONS = "http://localhost:3000/api/consultations";
const API_VACCINES = "http://localhost:3000/api/vaccines";
const API_APPOINTMENTS = "http://localhost:3000/api/appointments";
const API_PATIENTS = "http://localhost:3000/api/patients";

const params = new URLSearchParams(window.location.search);
const patientId = params.get("id");

if (!patientId) {
  alert("No se encontró el ID del paciente. Abre el expediente desde la card del paciente.");
  window.location.href = "./pacientes.html";
}
