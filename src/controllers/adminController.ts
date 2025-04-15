import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminService from "../services/adminService";

const JWT_SECRET = process.env.JWT_SECRET || "AAABBBCCC"; 

export const adminInit = async (req: Request, res: Response) => {
  try {
    const existingAdmins = await AdminService.list();
    if (existingAdmins.length > 0) {
      return res.status(400).json({ error: "Já existe um usuário admin cadastrado" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Informe email e password para criar o admin" });
    }

    const newAdmin = await AdminService.create({ email, password });

    return res.status(201).json({
      message: "Admin criado com sucesso!",
      admin: { id: newAdmin.id, email: newAdmin.email },
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar admin" });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Informe email e password" });
    }

    const admin = await AdminService.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ userId: admin.id }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({ message: "Login bem-sucedido!", token });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao fazer login do admin" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }
    const admin = await AdminService.getOne(req.userId);
    if (!admin) {
      return res.status(404).json({ error: "Admin não encontrado." });
    }
    return res.json({ admin: { id: admin.id, email: admin.email } });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar perfil do admin" });
  }
};
