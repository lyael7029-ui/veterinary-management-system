// ===============================
// CONFIGURACIÓN GLOBAL
// ===============================
// Aquí se concentran variables compartidas por los módulos de pacientes.

const API_PATIENTS = "http://localhost:3000/api/patients";

// Guarda el ID del paciente que se está editando.
// Si es null, el formulario crea un paciente nuevo.
let pacienteEditandoId = null;

// Copia local de todos los pacientes cargados desde el backend.
// Se usa para búsqueda y filtros sin pedir datos otra vez al servidor.
let pacientesGlobal = [];

// Filtro visual/funcional actualmente seleccionado.
let filtroActivo = "todos";
