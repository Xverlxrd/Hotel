import { DayOfWeek } from "generated/prisma";

export type TariffCreateInput = {
    dayOfWeek: DayOfWeek;
    coefficient: number;
};

export type TariffUpdateInput = Partial<TariffCreateInput>;