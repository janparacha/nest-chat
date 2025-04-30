import { CreateUserDto } from "./dto/create.user.dto";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly UserService;
    constructor(UserService: UserService);
    createUser(body: CreateUserDto): Promise<UserDto>;
    updateColor(req: any, data: {
        color: string;
    }): Promise<{
        email: string;
        password: string;
        id: string;
        color: string;
        isOnline: boolean;
        createdAt: Date;
    }>;
}
