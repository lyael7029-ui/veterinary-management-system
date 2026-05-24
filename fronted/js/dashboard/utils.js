function setFechaActual() {
  const fechaActual = document.getElementById("fechaActual");

  if (!fechaActual) return;

  fechaActual.textContent = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City"
  });
}

function fechaISOEnMexico(fecha) {
  return new Date(fecha).toLocaleDateString("sv-SE", {
    timeZone: "America/Mexico_City"
  });
}

function obtenerInicioDeHoy() {
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  return inicioHoy;
}
