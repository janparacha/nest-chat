import { CreateUserDto } from "src/users/dto/create.user.dto";
import { UserService } from "src/users/user.service";
import { AuthService } from "./auth.service";
import { UserDto } from "src/users/dto/user.dto";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(data: CreateUserDto): Promise<any>;
    register(data: CreateUserDto): Promise<UserDto>;
    verifyToken(authHeader: string): Promise<any>;
}
