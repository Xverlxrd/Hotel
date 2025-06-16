import { Router, Request, Response } from "express";
import {ClientService} from "@/services/Clients/clients.service";

const router = Router();
const clientService = new ClientService();

router.post('/', async (req: Request, res: Response) => {
    try {
        const clientData = req.body;

        if (!clientData.lastName || !clientData.firstName || !clientData.email || !clientData.phone || !clientData.passport) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: lastName, firstName, email, phone, passport'
            });
        }

        const newClient = await clientService.createClient(clientData);
        res.status(201).json({
            success: true,
            data: newClient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create client'
        });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const clients = await clientService.getAllClients();
        res.json({
            success: true,
            data: clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch clients'
        });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid client ID'
            });
        }

        const client = await clientService.getClientById(id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch client'
        });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid client ID'
            });
        }

        const clientData = req.body;

        if (!clientData || Object.keys(clientData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No data provided for update'
            });
        }

        const existingClient = await clientService.getClientById(id);
        if (!existingClient) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const updatedClient = await clientService.updateClient(id, clientData);
        res.json({
            success: true,
            data: updatedClient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update client'
        });
    }
});

export const clientRouter = router;