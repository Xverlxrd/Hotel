import { BookingStatus } from "generated/prisma";

export type BookingCreateInput = {
    clientId: number;
    roomId: number;
    startDate: Date;
    endDate: Date;
    status?: BookingStatus;
};

export type BookingUpdateInput = Partial<{
    roomId: number;
    startDate: Date;
    endDate: Date;
    status: BookingStatus;
}>;

export type BookingWithRelations = {
    id: number;
    clientId: number;
    roomId: number;
    startDate: Date;
    endDate: Date;
    status: BookingStatus;
    totalPrice: number | null;
    client: {
        id: number;
        lastName: string;
        firstName: string;
        email: string;
    };
    room: {
        id: number;
        number: string;
        type: string;
        category: string;
        pricePerNight: number;
    };
};