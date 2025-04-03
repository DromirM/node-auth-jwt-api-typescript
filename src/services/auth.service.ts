import { User } from "../models/user.interface";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

/*
  NOTA: En el futuro revisar como implementar un sistema de refresh tokens para ser capaz de actualizar los tokens del usuario
  mientras este sigue navegando por el sitio.
*/

export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
};
