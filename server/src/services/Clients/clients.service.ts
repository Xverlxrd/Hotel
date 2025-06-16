import {Client, Prisma, PrismaClient} from "generated/prisma";
import ClientCreateInput = Prisma.ClientCreateInput;
import {ClientWithBookings} from "@/types/clients.types";

const prisma = new PrismaClient()

export class ClientService {
    async createClient(clientData: ClientCreateInput) {
        return prisma.client.create({
            data: {
                lastName: clientData.lastName,
                firstName: clientData.firstName,
                middleName: clientData.middleName,
                email: clientData.email,
                phone: clientData.phone,
                passport: clientData.passport
            },
            include: {
                Booking: {
                    include: {
                        room: true
                    }
                }
            }
        });
    }

    async getAllClients(): Promise<ClientWithBookings[]> {
        return prisma.client.findMany({
            include: {
                Booking: {
                    include: {
                        room: true
                    },
                    orderBy: {
                        startDate: 'desc'
                    }
                }
            },
            orderBy: {
                lastName: 'asc'
            }
        });
    }

    async getClientById(id: number): Promise<ClientWithBookings | null> {
        return prisma.client.findUnique({
            where: { id },
            include: {
                Booking: {
                    include: {
                        room: true
                    },
                    orderBy: {
                        startDate: 'desc'
                    }
                }
            }
        });
    }

    async updateClient(id: number, clientData: Partial<ClientCreateInput>) {
        return prisma.client.update({
            where: { id },
            data: clientData,
            include: {
                Booking: {
                    include: {
                        room: true
                    }
                }
            }
        });
    }

    async deleteClient(id: number) {
        const activeBookings = await prisma.booking.findFirst({
            where: {
                clientId: id,
                status: {
                    in: ['CONFIRMED', 'PENDING']
                }
            }
        });

        if (activeBookings) {
            throw new Error('Cannot delete client with active bookings');
        }

        return prisma.client.delete({
            where: { id }
        });
    }
}