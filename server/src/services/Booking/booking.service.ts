import { PrismaClient, Booking, BookingStatus } from "generated/prisma";
import { BookingCreateInput, BookingUpdateInput } from "@/types/booking.types";
import {TariffService} from "@/services/Tariffs/tariffs.service";

const prisma = new PrismaClient();
const tariffService = new TariffService();

export class BookingService {
    async createBooking(bookingData: BookingCreateInput): Promise<Booking> {
        const isRoomAvailable = await this.isRoomAvailable(
            bookingData.roomId,
            bookingData.startDate,
            bookingData.endDate
        );

        if (!isRoomAvailable) {
            throw new Error('Room is not available for selected dates');
        }

        const totalPrice = await this.calculateBookingPrice(
            bookingData.roomId,
            bookingData.startDate,
            bookingData.endDate
        );

        return prisma.booking.create({
            data: {
                clientId: bookingData.clientId,
                roomId: bookingData.roomId,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                status: bookingData.status || 'PENDING',
                totalPrice
            },
            include: {
                client: true,
                room: true
            }
        });
    }

    async getAllBookings(): Promise<Booking[]> {
        return prisma.booking.findMany({
            include: {
                client: true,
                room: true
            },
            orderBy: {
                startDate: 'desc'
            }
        });
    }

    async getBookingById(id: number): Promise<Booking | null> {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                client: true,
                room: true
            }
        });
    }

    async updateBooking(id: number, bookingData: BookingUpdateInput): Promise<Booking> {
        if (bookingData.startDate || bookingData.endDate) {
            const booking = await this.getBookingById(id);
            if (!booking) throw new Error('Booking not found');

            const isRoomAvailable = await this.isRoomAvailable(
                booking.roomId,
                bookingData.startDate || booking.startDate,
                bookingData.endDate || booking.endDate,
                id
            );

            if (!isRoomAvailable) {
                throw new Error('Room is not available for selected dates');
            }
        }

        return prisma.booking.update({
            where: { id },
            data: bookingData,
            include: {
                client: true,
                room: true
            }
        });
    }

    async cancelBooking(id: number): Promise<Booking> {
        return prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                client: true,
                room: true
            }
        });
    }

    private async isRoomAvailable(
        roomId: number,
        startDate: Date,
        endDate: Date,
        excludeBookingId?: number
    ): Promise<boolean> {
        const conflictingBookings = await prisma.booking.findMany({
            where: {
                roomId,
                status: { in: ['CONFIRMED', 'PENDING'] },
                NOT: { id: excludeBookingId },
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate }
                    }
                ]
            }
        });

        return conflictingBookings.length === 0;
    }

    private async calculateBookingPrice(
        roomId: number,
        startDate: Date,
        endDate: Date
    ): Promise<number> {
        const room = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!room) throw new Error('Room not found');

        const days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const tariffs = await tariffService.getAllTariffs();
        const tariffMap = new Map<string, number>();
        tariffs.forEach(t => tariffMap.set(t.dayOfWeek, t.coefficient));

        let totalPrice = 0;
        const currentDate = new Date(startDate);

        for (let i = 0; i < days; i++) {
            const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
            const coefficient = tariffMap.get(dayOfWeek) || 1;
            totalPrice += room.pricePerNight * coefficient;

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return parseFloat(totalPrice.toFixed(2));
    }
}