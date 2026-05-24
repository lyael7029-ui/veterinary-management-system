// ===============================
// PETICIONES AL BACKEND
// Funciones para obtener, guardar y eliminar citas
// ===============================

async function obtenerCitas() {
  try {
    const response = await fetch(API_APPOINTMENTS);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
}

async function obtenerPacientes() {
  try {
    const response = await fetch(API_PATIENTS);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return [];
  }
}

async function guardarCita(datos) {
  const url = citaEditandoId
    ? `${API_APPOINTMENTS}/${citaEditandoId}`
    : API_APPOINTMENTS;

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

  return await response.json();
}

async function eliminarCitaPorId(id) {
  const response = await fetch(`${API_APPOINTMENTS}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la cita");
  }

  return await response.json();
}
