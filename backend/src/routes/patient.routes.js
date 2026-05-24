const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener pacientes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        patients.id,
        patients.name,
        patients.species,
        patients.breed,
        patients.age,
        patients.weight,
        patients.gender,
        patients.status,
        patients.allergies,
        owners.full_name AS owner_name,
        owners.phone,
        owners.email,
        owners.address
      FROM patients
      LEFT JOIN owners ON patients.owner_id = owners.id
      ORDER BY patients.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
});

// Crear paciente con dueño
router.post("/", async (req, res) => {
  const {
    owner_name,
    phone,
    email,
    address,
    name,
    species,
    breed,
    age,
    weight,
    gender,
    allergies,
    status
  } = req.body;

  try {
    const ownerResult = await pool.query(
      `INSERT INTO owners (full_name, phone, email, address)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [owner_name, phone, email, address]
    );

    const ownerId = ownerResult.rows[0].id;

    const patientResult = await pool.query(
      `INSERT INTO patients 
       (owner_id, name, species, breed, age, weight, gender, allergies, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [ownerId, name, species, breed, age, weight, gender, allergies, status]
    );

    res.status(201).json(patientResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear paciente" });
  }
});

// Editar paciente y datos del dueño
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    owner_name,
    phone,
    email,
    address,
    name,
    species,
    breed,
    age,
    weight,
    gender,
    allergies,
    status
  } = req.body;

  try {
    const patientResult = await pool.query(
      `UPDATE patients
       SET name=$1, species=$2, breed=$3, age=$4, weight=$5, gender=$6, allergies=$7, status=$8
       WHERE id=$9
       RETURNING *`,
      [name, species, breed, age, weight, gender, allergies, status, id]
    );

    const patient = patientResult.rows[0];

    await pool.query(
      `UPDATE owners
       SET full_name=$1, phone=$2, email=$3, address=$4
       WHERE id=$5`,
      [owner_name, phone, email, address, patient.owner_id]
    );

    res.json({
      message: "Paciente actualizado correctamente",
      patient
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar paciente" });
  }
});

// Eliminar paciente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM patients WHERE id=$1", [id]);
    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar paciente" });
  }
});

// Obtener un paciente por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        patients.*,
        owners.full_name AS owner_name,
        owners.phone,
        owners.email,
        owners.address
      FROM patients
      LEFT JOIN owners
        ON patients.owner_id = owners.id
      WHERE patients.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Paciente no encontrado"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener paciente"
    });
  }
});

module.exports = router;