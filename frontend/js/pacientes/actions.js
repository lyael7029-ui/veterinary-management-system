// ===============================
// ACCIONES CRUD DE PACIENTES
// ===============================
// Crear, editar, eliminar y abrir expedientes.

async function cargarPacientes() {
  try {
    const pacientes = await obtenerPacientesAPI();

    pacientesGlobal = pacientes;

    if (pacientes.length === 0) {
      renderSinPacientes();
      return;
    }

    renderPacientes(pacientes);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    renderErrorPacientes();
  }
}

async function editarPaciente(id) {
  try {

    const paciente = pacientesGlobal.find(p => p.id === id);

    if (!paciente) return;

    pacienteEditandoId = id;
    llenarFormularioPaciente(paciente);
    abrirModalPaciente();
  } catch (error) {
    console.error("Error al cargar paciente:", error);
  }
}

async function eliminarPaciente(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar este paciente?");

  if (!confirmar) return;

  try {
    await eliminarPacienteAPI(id);
    await cargarPacientes();
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    alert("Error al eliminar paciente");
  }
}

async function guardarPaciente(e) {
  e.preventDefault();

  const datos = Object.fromEntries(new FormData(formPaciente));

  datos.age = datos.age ? Number(datos.age) : null;
  datos.weight = datos.weight ? Number(datos.weight) : null;

  try {
    await guardarPacienteAPI(datos);
    cerrarModalPaciente();
    await cargarPacientes();
  } catch (error) {
    console.error("Error al guardar paciente:", error);
    alert("Error al guardar paciente");
  }
}

function abrirExpediente(id) {
  window.location.href = `./expedientes.html?id=${id}`;
}
