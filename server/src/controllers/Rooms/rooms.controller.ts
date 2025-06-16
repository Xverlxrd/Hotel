import { Router, Request, Response } from "express";
import {RoomService} from "@/services/Rooms/rooms.service";

const router = Router();
const roomService = new RoomService();

router.post('/', async (req: Request, res: Response) => {
    try {
        const roomData = req.body;

        if (!roomData.number || !roomData.type || !roomData.category) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: number, type, category'
            });
        }

        const existingRoom = await roomService.getRoomByNumber(roomData.number);
        if (existingRoom) {
            return res.status(400).json({
                success: false,
                message: 'Room with this number already exists'
            });
        }

        const newRoom = await roomService.createRoom(roomData);
        res.status(201).json({
            success: true,
            data: newRoom
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create room'
        });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.json({
            success: true,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch rooms'
        });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid room ID'
            });
        }

        const room = await roomService.getRoomById(id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch room'
        });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid room ID'
            });
        }

        const roomData = req.body;
        if (!roomData || Object.keys(roomData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No data provided for update'
            });
        }

        const existingRoom = await roomService.getRoomById(id);
        if (!existingRoom) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        if (roomData.number && roomData.number !== existingRoom.number) {
            const roomWithSameNumber = await roomService.getRoomByNumber(roomData.number);
            if (roomWithSameNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Room with this number already exists'
                });
            }
        }

        const updatedRoom = await roomService.updateRoom(id, roomData);
        res.json({
            success: true,
            data: updatedRoom
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update room'
        });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid room ID'
            });
        }

        await roomService.deleteRoom(id);
        res.json({
            success: true,
            message: 'Room deleted successfully'
        });
    } catch (error) {
        const status = error instanceof Error && error.message.includes('active bookings') ? 409 : 500;
        res.status(status).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete room'
        });
    }
});

export const roomRouter = router;