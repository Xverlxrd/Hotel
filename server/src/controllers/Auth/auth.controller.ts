import {Router, Request, Response} from "express";
import {AuthService} from "@/services/Auth/auth.service";
import {PrismaClient} from "generated/prisma";

const router = Router()

const authController = new AuthService()
const prisma = new PrismaClient()

router.post('/create', async (req: Request, res: Response) => {
    if (!req.body?.login?.length || !req.body?.password?.length) {
        return res.status(400).json({message: 'Text is required'})
    }
    const authCreate = await authController.createAuth(req.body)
    res.status(201).json(authCreate)
})

router.post('/login', async (req: Request, res: Response) => {
    try {
        if (!req.body?.login || !req.body?.password) {
            return res.status(400).json({ message: 'Login and password are required' });
        }

        const admin = await authController.login(req.body);
        res.json({
            success: true,
            message: 'Login successful',
            admin
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Authentication failed'
        });
    }
})

export const authRouter = router