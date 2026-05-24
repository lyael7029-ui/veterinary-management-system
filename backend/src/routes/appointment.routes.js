const express = require("express");
const router = express.Router();

const pool = require("../db");

// Obtener todas las citas
router.get("/", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        appointments.id,
        appointments.patient_id,
        appointments.appointment_date,
        appointments.reason,
        appointments.status,
        appointments.notes,

        patients.name AS patient_name,
        patients.breed,

        owners.full_name AS owner_name

      FROM appointments

      INNER JOIN patients
        ON appointments.patient_id = patients.id

      LEFT JOIN owners
        ON patients.owner_id = owners.id

      ORDER BY appointments.appointment_date ASC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener citas"
    });

  }

});

// Obtener citas de un paciente
router.get("/patient/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        appointments.*,
        patients.name AS patient_name,
        patients.breed,
        owners.full_name AS owner_name
      FROM appointments
      INNER JOIN patients
        ON appointments.patient_id = patients.id
      LEFT JOIN owners
        ON patients.owner_id = owners.id
      WHERE appointments.patient_id = $1
      ORDER BY appointments.appointment_date ASC
    `, [id]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener citas del paciente"
    });
  }
});

// Crear cita
router.post("/", async (req, res) => {

  const {
    patient_id,
    appointment_date,
    reason,
    status,
    notes
  } = req.body;

  try {

    const result = await pool.query(

      `INSERT INTO appointments
      (patient_id, appointment_date, reason, status, notes)

      VALUES ($1, $2, $3, $4, $5)

      RETURNING *`,

      [
        patient_id,
        appointment_date,
        reason,
        status || "Agendada",
        notes
      ]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al crear cita"
    });

  }

});

// Editar cita
router.put("/:id", async (req, res) => {

  const { id } = req.params;

  const {
    patient_id,
    appointment_date,
    reason,
    status,
    notes
  } = req.body;

  try {

    const result = await pool.query(

      `UPDATE appointments

      SET
        patient_id = $1,
        appointment_date = $2,
        reason = $3,
        status = $4,
        notes = $5

      WHERE id = $6

      RETURNING *`,

      [
        patient_id,
        appointment_date,
        reason,
        status,
        notes,
        id
      ]

    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al editar cita"
    });

  }

});

// Eliminar cita
router.delete("/:id", async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM appointments WHERE id = $1",
      [id]
    );

    res.json({
      message: "Cita eliminada correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al eliminar cita"
    });

  }

});

module.exports = router;