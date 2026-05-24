// ===============================
// FUNCIONES UTILITARIAS
// ===============================

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatearFechaSimple(fecha) {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function convertirFechaInput(fecha) {
  if (!fecha) return "";

  return new Date(fecha).toISOString().slice(0, 10);
}

function convertirFechaHoraInput(fecha) {
  if (!fecha) return "";

  return new Date(fecha).toISOString().slice(0, 16);
}
