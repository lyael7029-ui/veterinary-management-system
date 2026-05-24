// ===============================
// EXPORTAR EXPEDIENTE A PDF
// ===============================

const btnExportarPDF = document.getElementById("btnExportarPDF");

btnExportarPDF.addEventListener("click", () => {
  const expediente = document.getElementById("expedientePDF");
  const nombrePaciente =
    document.getElementById("nombrePaciente").textContent.trim();

  const opciones = {
    margin: 0.5,
    filename: `expediente-${nombrePaciente}.pdf`,
    image: {
      type: "jpeg",
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait"
    }
  };

  html2pdf()
    .set(opciones)
    .from(expediente)
    .save();
});