import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export interface IAdmin {
  email: string;
  password: string;
}

class AdminService {
  static async create(data: IAdmin) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  static async list() {
    return await prisma.user.findMany();
  }

  static async getOne(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async update(id: number, data: IAdmin) {
    try {
      const updateData: Partial<IAdmin> = {
        email: data.email,
      };

      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      return await prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error: unknown) {
      return error;
    }
  }

  static async delete(id: number) {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error: unknown) {
      return error;
    }
  }
}

export default AdminService;
