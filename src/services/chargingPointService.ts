import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface IChargingPoint {
  nome: string;
  endereco: string;
  tipoRecarga: string;
  status: boolean;
  horarioFuncionamento: string;
  responsavelNome: string;
  responsavelContato: string;
}

class ChargingPointService {
  static async create(data: IChargingPoint) {
    return await prisma.chargingPoint.create({
      data: {
        nome: data.nome,
        endereco: data.endereco,
        tipoRecarga: data.tipoRecarga,
        status: data.status,
        horarioFuncionamento: data.horarioFuncionamento,
        responsavelNome: data.responsavelNome,
        responsavelContato: data.responsavelContato,
      },
    });
  }

  static async list() {
    return await prisma.chargingPoint.findMany();
  }

  static async getOne(id: number) {
    return await prisma.chargingPoint.findUnique({
      where: { id },
    });
  }

  static async update(id: number, data: IChargingPoint) {
    try {
      return await prisma.chargingPoint.update({
        where: { id },
        data: {
          nome: data.nome,
          endereco: data.endereco,
          tipoRecarga: data.tipoRecarga,
          status: data.status,
          horarioFuncionamento: data.horarioFuncionamento,
          responsavelNome: data.responsavelNome,
          responsavelContato: data.responsavelContato,
        },
      });
    } catch (error: unknown) {
      return error;
    }
  }

  static async delete(id: number) {
    try {
      return await prisma.chargingPoint.delete({
        where: { id },
      });
    } catch (error: unknown) {
      return error;
    }
  }
}

export default ChargingPointService;
