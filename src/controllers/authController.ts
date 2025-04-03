import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../services/password.service";
import { generateToken } from "../services/auth.service";
import prisma from "../models/user";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "El password es obligatorio" });
      return;
    }
    const hashedPassword = await hashPassword(password);

    //Creamos una instancia de prisma.
    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    console.log(error);
    if (error?.code === "P2002" && error?.meta?.target.includes("email")) {
      res.status(400).json({
        message: "El email ingresado ya existe. Por favor, ingrese otro.",
      });
    }

    res.status(500).json({ error: "hubo un error en el registro." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "El password es obligatorio" });
      return;
    }

    const user = await prisma.findUnique({ where: { email: email } });
    if (!user) {
      res
        .status(404)
        .json({ error: "El usuario o la contraseña no fue encontrado." });
      return;
    }

    const passwordMatch = await comparePassword(password, user?.password); //Comparador de claves.

    if (!passwordMatch) {
      res
        .status(401)
        .json({ error: "El usuario o la contraseña no coinciden." });
      return;
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Se ha producido un error." });
  }
};
