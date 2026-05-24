const express = require("express");
const cors = require("cors");

const consultationRoutes = require("./routes/consultation.routes");
const patientRoutes = require("./routes/patient.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const vaccineRoutes = require("./routes/vaccine.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/consultations", consultationRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vaccines", vaccineRoutes);

app.get("/", (req, res) => {
  res.send("API Veterinaria funcionando 🐾");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});