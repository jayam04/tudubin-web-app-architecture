import express, { Request, Response, NextFunction } from "express";

import cors from "cors";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  password: string;
}

const users: User[] = [
  {
    id: 1,
    email: "admin@mail.com",
    username: "admin",
    role: "admin",
    password: "123123",
  },
];

const app = express();
app.use(cors());
app.use(express.json());

// Auth enpoint for login
const SECRET = "shhhhh"; // later: move to

process.env;

app.post("/api/login", (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const foundUser = users.find((user) => user.email === email);
  if (!foundUser || foundUser.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: foundUser.id }, SECRET);
  res.json({ token });
});
interface AuthRequest extends Request {
  user?: any;
}

const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    console.log("Decoded JWT:", decoded);
    console.log("Request User:", req.user);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript!");
});

app.get("/api/protected", verifyJWT, (req: AuthRequest, res: Response) => {
  res.json({ message: "Welcome, authorized user!", user: req.user });
});

app.get("/api/users", verifyJWT, (req: AuthRequest, res: Response) => {
  const user = users.find((user) => {
    console.log("User ID:", user.id, "Request User ID:", req.user.id);
    return user.id === req.user.id;
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.listen(9000, () => {
  console.log("Server running at http://localhost:9000");
});
