import { Router, Request, Response } from "express";
import { DayOfWeek } from "generated/prisma";
import {TariffService} from "@/services/Tariffs/tariffs.service";

const router = Router();
const tariffService = new TariffService();

router.post('/', async (req: Request, res: Response) => {
    try {
        const tariffData = req.body;

        if (!tariffData.dayOfWeek || tariffData.coefficient === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: dayOfWeek, coefficient'
            });
        }

        const existingTariff = await tariffService.getTariffByDay(tariffData.dayOfWeek);
        if (existingTariff) {
            return res.status(400).json({
                success: false,
                message: 'Tariff for this day already exists'
            });
        }

        const newTariff = await tariffService.createTariff(tariffData);
        res.status(201).json({
            success: true,
            data: newTariff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create tariff'
        });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const tariffs = await tariffService.getAllTariffs();
        res.json({
            success: true,
            data: tariffs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch tariffs'
        });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tariff ID'
            });
        }

        const tariff = await tariffService.getTariffById(id);
        if (!tariff) {
            return res.status(404).json({
                success: false,
                message: 'Tariff not found'
            });
        }

        res.json({
            success: true,
            data: tariff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch tariff'
        });
    }
});

router.get('/day/:day', async (req: Request, res: Response) => {
    try {
        const day = req.params.day.toUpperCase() as DayOfWeek;

        if (!Object.values(DayOfWeek).includes(day)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid day of week'
            });
        }

        const tariff = await tariffService.getTariffByDay(day);
        if (!tariff) {
            return res.status(404).json({
                success: false,
                message: 'Tariff for this day not found'
            });
        }

        res.json({
            success: true,
            data: tariff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch tariff'
        });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tariff ID'
            });
        }

        const tariffData = req.body;
        if (!tariffData || Object.keys(tariffData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No data provided for update'
            });
        }

        const existingTariff = await tariffService.getTariffById(id);
        if (!existingTariff) {
            return res.status(404).json({
                success: false,
                message: 'Tariff not found'
            });
        }

        if (tariffData.dayOfWeek && tariffData.dayOfWeek !== existingTariff.dayOfWeek) {
            const tariffForDay = await tariffService.getTariffByDay(tariffData.dayOfWeek);
            if (tariffForDay) {
                return res.status(400).json({
                    success: false,
                    message: 'Tariff for this day already exists'
                });
            }
        }

        const updatedTariff = await tariffService.updateTariff(id, tariffData);
        res.json({
            success: true,
            data: updatedTariff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update tariff'
        });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tariff ID'
            });
        }

        await tariffService.deleteTariff(id);
        res.json({
            success: true,
            message: 'Tariff deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete tariff'
        });
    }
});

export const tariffRouter = router;