// ===============================
// FILTROS DE PACIENTES
// ===============================
// Maneja los botones: Todos, En clínica y Urgente.

const btnAllPets = document.getElementById("btnAllPets");
const btnInClinic = document.getElementById("btnInClinic");
const btnUrgent = document.getElementById("btnUrgent");

function aplicarFiltroEstado(pacientes) {
  if (filtroActivo === "en-tratamiento") {
    return pacientes.filter(paciente => paciente.status === "En tratamiento");
  }

  if (filtroActivo === "urgente") {
    return pacientes.filter(paciente => paciente.status === "Urgente");
  }

  return pacientes;
}

function actualizarVistaPacientes() {
  const pacientesFiltrados = aplicarBusqueda(
    aplicarFiltroEstado(pacientesGlobal)
  );

  renderPacientes(pacientesFiltrados);
}

function resetFiltrosVisuales() {
  [btnAllPets, btnInClinic, btnUrgent].forEach(btn => {
    btn.classList.remove(
      "bg-white",
      "shadow-sm",
      "text-primary",
      "font-bold"
    );

    btn.classList.add("text-on-surface-variant");
  });
}

function activarBotonFiltro(btn) {
  resetFiltrosVisuales();

  btn.classList.add(
    "bg-white",
    "shadow-sm",
    "text-primary",
    "font-bold"
  );
}
