const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Получение всех пользователей
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error("Ошибка при получении пользователей: ", err);
        res.status(500).send("Ошибка сервера");
    }
});

// Добавление нового пользователя
app.post("/users", async (req, res) => {
    const { login, password, authcod } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO users (login, passwor, authcod) VALUES ($1, $2, $3) RETURNING *",
            [login, password, authcod]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Ошибка при добавлении пользователя: ", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
