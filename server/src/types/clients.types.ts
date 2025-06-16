import { Booking, Room, BookingStatus } from "generated/prisma";

export type ClientCreateInput = {
    lastName: string;
    firstName: string;
    middleName?: string | null;
    email: string;
    phone: string;
    passport: string;
};

export type BookingWithRoom = Booking & {
    room: Room;
};

export type ClientWithBookings = {
    id: number;
    lastName: string;
    firstName: string;
    middleName?: string | null;
    email: string;
    phone: string;
    passport: string;
    Booking: BookingWithRoom[];
};