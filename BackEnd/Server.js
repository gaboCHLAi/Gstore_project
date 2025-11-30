import express from "express";
import cors from "cors";
import multer from "multer";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const app = express();


app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

app.get("/VacancyData", async (req, res) => {
  const id = Number(req.query.id);

  try {
    let Vacancy = null;
    if (!isNaN(id)) {
      Vacancy = await pool.query(`SELECT * FROM vacancies where id = ${id}`);
     
    } else {
      Vacancy = await pool.query("select * from vacancies");
       
    }
    res.json(Vacancy.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/Apply", upload.single("cv"), async (req, res) => {
  try {
    const { name, lastName, email, number, vacancyid } = req.body;
    const cv = req.file;

    if (!cv) return res.status(400).json({ error: "CV is required" });

    

    const query = `
      INSERT INTO resumes (firstname, lastname, email, phonenumber, vacancyid, resume)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, lastName, email, number, vacancyid, cv.buffer];

    const result = await pool.query(query, values);

    res.json({ message: "Application saved to database!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/resumes", async (req, res) => {
  const { vacancy, date, searchTerm } = req.query;

  let query = `SELECT resumes.firstname, resumes.email, resumes.created_at, resumes.id,  vacancies.title as vacancies_title
               FROM resumes resumes
               INNER JOIN vacancies ON  resumes.vacancyId = vacancies.id
               WHERE 1=1`;

  const values = [];

  if (vacancy) {
    values.push(vacancy);
    query += ` AND vacancies.title = $${values.length}`;
  }

  if (date) {
    values.push(date);
    query += ` AND DATE(resumes.created_at) = $${values.length}`;
  }
  if (searchTerm) {
    values.push(`%${searchTerm}%`);

    query += ` AND (resumes.firstname ILIKE $${values.length} OR resumes.email ILIKE $${values.length})`;
  }

  query += ` ORDER BY resumes.created_at DESC`;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/download/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT resume, firstname, lastname FROM resumes WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0 || !result.rows[0].resume)
      return res.status(404).send("File not found");

    const file = result.rows[0].resume;
    const { firstname, lastname } = result.rows[0];
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${firstname}_${lastname}_CV.pdf`
    );

    res.send(file);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/open/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT resume, firstname, lastname FROM resumes WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0 || !result.rows[0].resume)
      return res.status(404).send("File not found");

    const file = result.rows[0].resume;
    const { firstname, lastname } = result.rows[0];
   

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${firstname}_${lastname}_CV.pdf`
    );

    res.send(file);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/ResumeDates", async (req, res) => {
  try {
    const response =
      await pool.query(`SELECT DATE(created_at) AS date, MIN(id) AS id
              FROM resumes
              GROUP BY DATE(created_at)
              ORDER BY date DESC;
              `);
    res.json(response.rows);
  } catch (err) {
    
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
