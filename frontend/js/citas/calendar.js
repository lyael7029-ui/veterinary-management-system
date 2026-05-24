// ===============================
// CALENDARIO FULLCALENDAR
// Inicializa el calendario y abre modal al editar
// ===============================

function convertirCitasAEventos(citas) {
  return citas.map((cita) => ({
    id: cita.id,
    title: `${cita.patient_name || "Paciente"} - ${cita.reason || "Cita"}`,
    start: cita.appointment_date,
    color: obtenerColorEstado(cita.status),
    extendedProps: {
      patient_id: cita.patient_id,
      reason: cita.reason,
      owner: cita.owner_name,
      breed: cita.breed,
      notes: cita.notes,
      status: cita.status
    }
  }));
}

function inicializarCalendario(citas) {
  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) return;

  calendarioCitas = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    height: "auto",
    events: convertirCitasAEventos(citas),

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },

    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día"
    },

    eventClick: async function (info) {
      await abrirModalEditarCita(info.event);
    }
  });

  calendarioCitas.render();
}
