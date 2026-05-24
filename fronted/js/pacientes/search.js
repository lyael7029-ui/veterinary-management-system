// ===============================
// BÚSQUEDA DE PACIENTES
// ===============================
// Filtra por nombre de mascota, raza o dueño usando los datos ya cargados.

const searchInput = document.getElementById("searchPacientes");

function obtenerTextoBusqueda() {
  return searchInput.value.trim().toLowerCase();
}

function aplicarBusqueda(pacientes) {
  const texto = obtenerTextoBusqueda();

  if (!texto) return pacientes;

  return pacientes.filter(paciente => {
    return (
      paciente.name?.toLowerCase().includes(texto) ||
      paciente.breed?.toLowerCase().includes(texto) ||
      paciente.owner_name?.toLowerCase().includes(texto)
    );
  });
}
