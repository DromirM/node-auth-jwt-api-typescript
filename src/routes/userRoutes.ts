import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/usersController";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

//Middlewares de JWT para autentificar si estamos logueados.

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error en la autentificacion: ", err);
      res.status(403).json({ error: "No tienes acceso a este recurso" });
      return;
    }
    next();
  });
};

router.post("/", authenticateToken, createUser);

router.get("/", authenticateToken, getAllUsers);

router.get("/:id", authenticateToken, getUserById);

router.put("/:id", authenticateToken, updateUser);

router.delete("/:id", authenticateToken, deleteUser);

export default router;
