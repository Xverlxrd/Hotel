import { Router, Request, Response } from "express";
import { BookingService } from "@/services/Booking/booking.service";

const router = Router();
const bookingService = new BookingService();

router.post('/', async (req: Request, res: Response) => {
    try {
        const bookingData = req.body;

        // Валидация
        if (!bookingData.clientId || !bookingData.roomId || !bookingData.startDate || !bookingData.endDate) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: clientId, roomId, startDate, endDate'
            });
        }

        // Проверка дат
        const startDate = new Date(bookingData.startDate);
        const endDate = new Date(bookingData.endDate);

        if (startDate >= endDate) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const newBooking = await bookingService.createBooking({
            ...bookingData,
            startDate,
            endDate
        });

        res.status(201).json({
            success: true,
            data: newBooking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create booking'
        });
    }
});

// Получение всех бронирований
router.get('/', async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch bookings'
        });
    }
});

// Получение бронирования по ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
        }

        const booking = await bookingService.getBookingById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch booking'
        });
    }
});

// Обновление бронирования
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
        }

        const bookingData = req.body;
        if (!bookingData || Object.keys(bookingData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No data provided for update'
            });
        }

        // Проверка дат, если они обновляются
        if (bookingData.startDate || bookingData.endDate) {
            const startDate = new Date(bookingData.startDate);
            const endDate = new Date(bookingData.endDate);

            if (startDate >= endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }

        const updatedBooking = await bookingService.updateBooking(id, bookingData);
        res.json({
            success: true,
            data: updatedBooking
        });
    } catch (error) {
        const status = error instanceof Error && error.message.includes('not available') ? 400 : 500;
        res.status(status).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update booking'
        });
    }
});

// Отмена бронирования
router.patch('/:id/cancel', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
        }

        const cancelledBooking = await bookingService.cancelBooking(id);
        res.json({
            success: true,
            data: cancelledBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to cancel booking'
        });
    }
});

export const bookingRouter = router;