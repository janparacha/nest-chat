import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getMessages(userId: string): Promise<({
        sender: {
            id: string;
            email: string;
            password: string;
            color: string;
            createdAt: Date;
        };
        receiver: {
            id: string;
            email: string;
            password: string;
            color: string;
            createdAt: Date;
        };
    } & {
        id: string;
        color: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string;
    })[]>;
    getMessagesBetweenUsers(userId1: string, userId2: string): Promise<({
        sender: {
            id: string;
            email: string;
            password: string;
            color: string;
            createdAt: Date;
        };
        receiver: {
            id: string;
            email: string;
            password: string;
            color: string;
            createdAt: Date;
        };
    } & {
        id: string;
        color: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string;
    })[]>;
    createMessage(data: {
        content: string;
        color: string;
        senderId: string;
        receiverId: string;
    }): Promise<{
        sender: {
            id: string;
            email: string;
            password: string;
            color: string;
            createdAt: Date;
        };
        receiver: {
            id: string;
            email: string;
            password: string;
            color: string;
            createdAt: Date;
        };
    } & {
        id: string;
        color: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string;
    }>;
}
