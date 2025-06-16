import { PrismaClient, Room, RoomType, RoomCategory } from "generated/prisma";
import {RoomCreateInput, RoomUpdateInput} from "@/types/rooms.types";

const prisma = new PrismaClient();

export class RoomService {
    async createRoom(roomData: RoomCreateInput): Promise<Room> {
        return prisma.room.create({
            data: {
                number: roomData.number,
                type: roomData.type,
                category: roomData.category,
                hasChildBed: roomData.hasChildBed || false,
                isAvailable: roomData.isAvailable !== false,
                pricePerNight: roomData.pricePerNight || 1000.0
            }
        });
    }

    async getAllRooms(): Promise<Room[]> {
        return prisma.room.findMany({
            orderBy: { number: 'asc' }
        });
    }

    async getRoomById(id: number): Promise<Room | null> {
        return prisma.room.findUnique({
            where: { id }
        });
    }

    async getRoomByNumber(number: string): Promise<Room | null> {
        return prisma.room.findUnique({
            where: { number }
        });
    }

    async updateRoom(id: number, roomData: RoomUpdateInput): Promise<Room> {
        return prisma.room.update({
            where: { id },
            data: roomData
        });
    }

    async deleteRoom(id: number): Promise<Room> {
        const activeBookings = await prisma.booking.findFirst({
            where: {
                roomId: id,
                status: { in: ['CONFIRMED', 'PENDING'] }
            }
        })

        if (activeBookings) {
            throw new Error('Cannot delete room with active bookings');
        }

        return prisma.room.delete({
            where: { id }
        });
    }
}