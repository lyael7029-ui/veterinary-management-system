const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener vacunas
router.get("/", async (req, res) => {

  try {
    const result = await pool.query(`
      SELECT
        vaccines.*,
        patients.name AS patient_name,
        patients.breed,
        owners.full_name AS owner_name
      FROM vaccines
      INNER JOIN patients ON vaccines.patient_id = patients.id
      LEFT JOIN owners ON patients.owner_id = owners.id
      ORDER BY vaccines.next_dose ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener vacunas" });
  }
});

// Obtener vacunas de un paciente
router.get("/patient/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(`

      SELECT

        vaccines.*,

        patients.name AS patient_name,

        patients.breed,

        owners.full_name AS owner_name

      FROM vaccines

      INNER JOIN patients
        ON vaccines.patient_id = patients.id

      LEFT JOIN owners
        ON patients.owner_id = owners.id

      WHERE vaccines.patient_id = $1

      ORDER BY vaccines.next_dose ASC

    `, [id]);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener vacunas del paciente"
    });

  }

});

// Crear vacuna
router.post("/", async (req, res) => {
  const {
    patient_id,
    vaccine_name,
    application_date,
    next_dose,
    status
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vaccines
      (patient_id, vaccine_name, application_date, next_dose, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        patient_id,
        vaccine_name,
        application_date,
        next_dose,
        status || "Aplicada"
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear vacuna" });
  }
});

// Editar vacuna
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    vaccine_name,
    application_date,
    next_dose,
    status
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vaccines
       SET vaccine_name=$1, application_date=$2, next_dose=$3, status=$4
       WHERE id=$5
       RETURNING *`,
      [vaccine_name, application_date, next_dose, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar vacuna" });
  }
});

// Eliminar vacuna
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM vaccines WHERE id=$1", [id]);

    res.json({ message: "Vacuna eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar vacuna" });
  }
});

module.exports = router;