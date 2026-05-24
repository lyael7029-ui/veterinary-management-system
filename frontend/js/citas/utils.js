// ===============================
// UTILIDADES DE CITAS
// Formato de fechas, horas y colores de estado
// ===============================

function obtenerColorEstado(status) {
  switch (status?.toLowerCase()) {
    case "agendada":
      return "#2563eb";

    case "completada":
      return "#16a34a";

    case "cancelada":
      return "#dc2626";

    default:
      return "#f59e0b";
  }
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City"
  });
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Mexico_City"
  });
}

function convertirFechaParaInput(fecha) {
  if (!fecha) return "";

  const date = new Date(fecha);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}

function obtenerInicioHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
}
