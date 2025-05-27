import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getMessages(req: any): Promise<({
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
    getMessagesBetweenUsers(req: any, userId: string): Promise<({
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
}
