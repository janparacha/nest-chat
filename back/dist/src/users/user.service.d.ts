import { PrismaService } from "../services/prisma.service";
import { UserDto } from "./dto/user.dto";
import { CreateUserDto } from './dto/create.user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: CreateUserDto): Promise<UserDto>;
    findOne(email: string, showPassword?: boolean): Promise<UserDto | null>;
    updateUserStatus(userId: string, isOnline: boolean): Promise<{
        email: string;
        password: string;
        id: string;
        color: string;
        isOnline: boolean;
        createdAt: Date;
    }>;
    updateUserColor(userId: string, color: string): Promise<{
        email: string;
        password: string;
        id: string;
        color: string;
        isOnline: boolean;
        createdAt: Date;
    }>;
    createMessage(data: {
        content: string;
        senderId: string;
        receiverId: string;
    }): Promise<{
        sender: {
            email: string;
            password: string;
            id: string;
            color: string;
            isOnline: boolean;
            createdAt: Date;
        };
        receiver: {
            email: string;
            password: string;
            id: string;
            color: string;
            isOnline: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string;
    }>;
    comparePassword(inputPassword: string, userPassword: string): boolean;
}
