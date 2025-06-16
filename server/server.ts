import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from './generated/prisma';
import {authRouter} from "@/controllers/Auth/auth.controller";
import {clientRouter} from "@/controllers/Clients/clients.controller";
import {roomRouter} from "@/controllers/Rooms/rooms.controller";
import {tariffRouter} from "@/controllers/Tariffs/tariffs.controller";
import {bookingRouter} from "@/controllers/Booking/booking.controller";

dotenv.config()

const app = express()
export const prisma = new PrismaClient()

async function Main() {

    app.use(express.json())


    app.use('/api/auth', authRouter)
    app.use('/api/clients', clientRouter)
    app.use('/api/rooms', roomRouter)
    app.use('/api/tariffs', tariffRouter)
    app.use('/api/bookings', bookingRouter)

    app.listen(process.env.PORT || 4200, () => {
        console.log('Сервер запущен на порту 4200')
    })
}

Main()
.then(async () => {
    await prisma.$connect()
})
.catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})