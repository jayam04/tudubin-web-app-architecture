import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { initDb } from "./db";
import studentRouter from "./routes/student";


const app = express();
const PORT = 9000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<h1>Student API</h1>");
});

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

app.use("/v1/students", studentRouter);

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Student API",
        version: "1.0.0",
        description: "API for managing students",
    },
    servers: [
        {
            url: `http://localhost:${PORT}`,
            description: "Development server",
        },
    ],
    paths: {}
};

const swaggerOptions = {
    definition: swaggerDefinition,
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
