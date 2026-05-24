const express = require("express");

const router = express.Router();

const pool = require("../db");

// Obtener consultas
router.get("/", async (req, res) => {

  try {

    const result = await pool.query(`

      SELECT

        consultations.*,

        patients.name AS patient_name,

        patients.breed,

        owners.full_name AS owner_name

      FROM consultations

      INNER JOIN patients
        ON consultations.patient_id = patients.id

      LEFT JOIN owners
        ON patients.owner_id = owners.id

      ORDER BY consultations.consultation_date DESC

    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener consultas"
    });

  }

});

// Obtener consultas de un paciente
router.get("/patient/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(`

      SELECT

        consultations.*,

        patients.name AS patient_name,

        patients.breed,

        owners.full_name AS owner_name

      FROM consultations

      INNER JOIN patients
        ON consultations.patient_id = patients.id

      LEFT JOIN owners
        ON patients.owner_id = owners.id

      WHERE consultations.patient_id = $1

      ORDER BY consultations.consultation_date DESC

    `, [id]);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener consultas del paciente"
    });

  }

});

// Crear consulta
router.post("/", async (req, res) => {

  const {
    patient_id,
    diagnosis,
    treatment,
    notes,
    veterinarian
  } = req.body;

  try {

    const result = await pool.query(

      `INSERT INTO consultations
      (
        patient_id,
        diagnosis,
        treatment,
        notes,
        veterinarian
      )

      VALUES ($1, $2, $3, $4, $5)

      RETURNING *`,

      [
        patient_id,
        diagnosis,
        treatment,
        notes,
        veterinarian
      ]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al crear consulta"
    });

  }

});

// Editar consulta
router.put("/:id", async (req, res) => {

  const { id } = req.params;

  const {
    diagnosis,
    treatment,
    notes,
    veterinarian
  } = req.body;

  try {

    const result = await pool.query(

      `UPDATE consultations

      SET
        diagnosis = $1,
        treatment = $2,
        notes = $3,
        veterinarian = $4

      WHERE id = $5

      RETURNING *`,

      [
        diagnosis,
        treatment,
        notes,
        veterinarian,
        id
      ]

    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al editar consulta"
    });

  }

});

// Eliminar consulta
router.delete("/:id", async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM consultations WHERE id = $1",
      [id]
    );

    res.json({
      message: "Consulta eliminada"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al eliminar consulta"
    });

  }

});

module.exports = router;