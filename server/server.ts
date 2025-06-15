import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from './generated/prisma';

dotenv.config()

const app = express()
export const prisma = new PrismaClient()

async function Main() {

    app.use(express.json())


    // app.use('/api/twits', twitRouter)


    // app.use((req, res) => {
    //     res.status(404).json({ message: 'Not Found' });
    // });

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