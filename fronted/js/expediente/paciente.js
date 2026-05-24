// ===============================
// DATOS DEL PACIENTE EN EL EXPEDIENTE
// ===============================

async function cargarPaciente() {
  try {
    const response = await fetch(`${API_PATIENTS}/${patientId}`);
    const paciente = await response.json();

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
    console.error("Error al cargar paciente:", error);
  }
}
