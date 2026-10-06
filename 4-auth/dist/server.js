"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users = [
    {
        id: 1,
        email: "admin@mail.com",
        username: "admin",
        role: "admin",
        password: "123123",
    },
];
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Auth enpoint for login
const SECRET = "shhhhh"; // later: move to
process.env;
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const foundUser = users.find((user) => user.email === email);
    if (!foundUser || foundUser.password !== password) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: foundUser.id }, SECRET);
    res.json({ token });
});
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.user = decoded;
        console.log("Decoded JWT:", decoded);
        console.log("Request User:", req.user);
        next();
    }
    catch {
        res.status(401).json({ message: "Unauthorized" });
    }
};
app.get("/", (req, res) => {
    res.send("Hello World with TypeScript!");
});
app.get("/api/protected", verifyJWT, (req, res) => {
    res.json({ message: "Welcome, authorized user!", user: req.user });
});
app.get("/api/users", verifyJWT, (req, res) => {
    const user = users.find((user) => user.id === req.user.id);
    if (!user)
        return;
    res.status(404).json({ message: "User not found" });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});
app.listen(9000, () => {
    console.log("Server running at http://localhost:9000");
});
