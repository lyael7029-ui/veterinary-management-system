const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "vet_user",
    password: "vet_password",
    database: "veterinaria"
});

module.exports = pool;