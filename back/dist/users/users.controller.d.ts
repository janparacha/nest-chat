import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        id: string;
        email: string;
        color: string;
        createdAt: Date;
    }[]>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        color: string;
    }>;
    updateColor(req: any, body: {
        color: string;
    }): Promise<{
        id: string;
        email: string;
        password: string;
        color: string;
        createdAt: Date;
    }>;
}
