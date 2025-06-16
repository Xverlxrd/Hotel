import { PrismaClient, Tariff, DayOfWeek } from "generated/prisma";
import {TariffCreateInput, TariffUpdateInput} from "@/types/tariffs.types";

const prisma = new PrismaClient();

export class TariffService {
    async createTariff(tariffData: TariffCreateInput): Promise<Tariff> {
        return prisma.tariff.create({
            data: {
                dayOfWeek: tariffData.dayOfWeek,
                coefficient: tariffData.coefficient
            }
        });
    }

    async getAllTariffs(): Promise<Tariff[]> {
        return prisma.tariff.findMany({
            orderBy: { dayOfWeek: 'asc' }
        });
    }

    async getTariffById(id: number): Promise<Tariff | null> {
        return prisma.tariff.findUnique({
            where: { id }
        });
    }

    async getTariffByDay(dayOfWeek: DayOfWeek): Promise<Tariff | null> {
        return prisma.tariff.findFirst({
            where: { dayOfWeek }
        });
    }

    async updateTariff(id: number, tariffData: TariffUpdateInput): Promise<Tariff> {
        return prisma.tariff.update({
            where: { id },
            data: tariffData
        });
    }

    async deleteTariff(id: number): Promise<Tariff> {
        return prisma.tariff.delete({
            where: { id }
        });
    }
}