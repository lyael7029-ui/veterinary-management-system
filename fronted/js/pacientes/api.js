// ===============================
// PETICIONES AL BACKEND
// ===============================
// Este archivo concentra las llamadas HTTP relacionadas con pacientes.

async function obtenerPacientesAPI() {
  const respuesta = await fetch(API_PATIENTS);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los pacientes");
  }

  return await respuesta.json();
}

async function guardarPacienteAPI(datos) {
  const url = pacienteEditandoId
    ? `${API_PATIENTS}/${pacienteEditandoId}`
    : API_PATIENTS;

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

  return await respuesta.json();
}

async function eliminarPacienteAPI(id) {
  const respuesta = await fetch(`${API_PATIENTS}/${id}`, {
    method: "DELETE"
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el paciente");
  }

  return await respuesta.json();
}
