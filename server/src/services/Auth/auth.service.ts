import {Admin, PrismaClient} from "generated/prisma";
import {UserType} from "@/types/auth.types";

const prisma = new PrismaClient()

export class AuthService {
    createAuth(admin: UserType): Promise<Admin> {
        return prisma.admin.create({
            data: admin
        })
    }

    async login(admin: UserType): Promise<Admin | null> {
        const foundAdmin = await prisma.admin.findUnique({
            where: {
                login: admin.login
            }
        });

        if (!foundAdmin) {
            throw new Error('Admin not found');
        }

        if (foundAdmin.password !== admin.password) {
            throw new Error('Invalid password');
        }

        const { password, ...adminWithoutPassword } = foundAdmin;
        return adminWithoutPassword as Admin;
    }
}