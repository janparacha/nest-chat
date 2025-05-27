import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(email: string, password: string): Promise<{
        id: string;
        email: string;
        password: string;
        color: string;
        createdAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        color: string;
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        color: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        color: string;
        createdAt: Date;
    }[]>;
    updateColor(id: string, color: string): Promise<{
        id: string;
        email: string;
        password: string;
        color: string;
        createdAt: Date;
    }>;
}
