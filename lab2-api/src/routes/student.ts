import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { openDb } from "../db";

const router = Router();

export default router;

/**
 * @swagger
 * /v1/students:
 *  get:
 *     summary: Retrieve a list of students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of students
 */
router.get("/", async (req, res) => {
    const db = await openDb();
    const students = await db.all("SELECT * FROM students");
    res.json({ value: students });
});


/**
 * @swagger
 * /v1/students/{id}:
 *  get:
 *     summary: Retrieve a single student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: A single student
 *       404:
 *         description: Student not found
 */
router.get("/:id", async (req, res) => {
    const db = await openDb();
    const student = await db.get("SELECT * FROM students WHERE id = ?", req.params.id);
    if (!student) {
        res.status(404).json({ error: "Student not found" });
    } else {
        res.json(student);
    }
});

/**
 * @swagger
 * /v1/students:
 *  post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - studentNumber
 *               - email
 *               - course
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               studentNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created student
 */
router.post("/", async (req, res) => {
    const { firstName, lastName, studentNumber, email, course } = req.body;
    const id = uuidv4();
    const db = await openDb();
    await db.run(
        "INSERT INTO students (id, firstName, lastName, studentNumber, email, course) VALUES (?, ?, ?, ?, ?, ?)",
        [id, firstName, lastName, studentNumber, email, course]
    );

    const newStudent = await db.get("SELECT * FROM students WHERE id = ?", id);
    res.status(201).json(newStudent);
});

/**
 * @swagger
 * /v1/students/{id}:
 *  put:
 *     summary: Update an existing student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            required:
 *             - firstName
 *             - lastName
 *             - studentNumber
 *             - email
 *             - course
 *           properties:
 *              firstName:
 *               type: string
 *              lastName:
 *               type: string
 *              studentNumber:
 *               type: string
 *              email:
 *               type: string
 *              course:
 *               type: string
 *     responses:
 *       200:
 *         description: The updated student
 *       404:
 *         description: Student not found
 */
router.put("/:id", async (req, res) => {
    const db = await openDb();
    const { firstName, lastName, studentNumber, email, course } = req.body;
    await db.run(
        "UPDATE students SET firstName = ?, lastName = ?, studentNumber = ?, email = ?, course = ? WHERE id = ?",
        [
            firstName,
            lastName,
            studentNumber,
            email,
            course,
            req.params.id
        ]
    );

    const updatedStudent = await db.get("SELECT * FROM students WHERE id = ?", req.params.id);
    res.json(updatedStudent);
});

/**
 * @swagger
 * /v1/students/{id}:
 *  delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       204:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete("/:id", async (req, res) => {
    const db = await openDb();
    await db.run("DELETE FROM students WHERE id = ?", req.params.id);
    res.status(204).send();
});

