import {IClient} from "@/types/types";
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