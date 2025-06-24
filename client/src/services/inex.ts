import {IBoking, IClient, IRoom} from "@/types/types";
import axios from "axios";

export class ClientService {
    private baseUrl = 'http://localhost:4200/api/clients';

    async getAllClients(): Promise<IClient[]> {
        const response = await axios.get(this.baseUrl);
        return response.data.data;
    }

    async createClient(clientData: {
        firstName: string;
        lastName: string;
        middleName: string;
        phone: string;
        email: string;
        passport: string
    }): Promise<IClient> {
        const response = await axios.post(this.baseUrl, clientData);
        return response.data;
    }

    async deleteClient(id: number): Promise<void> {
        await axios.delete(`${this.baseUrl}/${id}`);
    }
}

export class RoomService {
    private baseUrl = 'http://localhost:4200/api/rooms';

    async getAllRooms(): Promise<IRoom[]> {
        const response = await axios.get(this.baseUrl);
        return response.data.data;
    }

    async updateRoom(id: number, roomData: {
        number?: string;
        type?: string;
        category?: string;
        hasChildBed?: boolean;
        isAvailable?: boolean;
        pricePerNight?: number;
    }): Promise<void> {
        await axios.patch(`${this.baseUrl}/${id}`, roomData);
    }
}

export class BookingService {
    private baseUrl = 'http://localhost:4200/api/bookings';

    async getAllBookings(): Promise<IBoking[]> {
        const response = await axios.get(this.baseUrl);
        return response.data.data;
    }
    async cancelBooking(id: number): Promise<void> {
        await axios.patch(`${this.baseUrl}/${id}/cancel`);
    }
    async updateBookingStatus(id: number, bookingData: {
        status?: string;
    }): Promise<void> {
        await axios.put(`${this.baseUrl}/${id}`, bookingData);
    }
    async createBooking(bookingData: {
        clientId: number;
        roomId: number;
        startDate: string;
        endDate: string;
    }): Promise<void> {
        await axios.post(this.baseUrl, bookingData);
    }
}