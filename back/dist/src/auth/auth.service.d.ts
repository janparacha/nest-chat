import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create.user.dto";
import { UserService } from "../users/user.service";
export declare class AuthService {
    private usersService;
    private readonly jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    signIn(data: CreateUserDto): Promise<any>;
    verifyToken(token: string): Promise<Boolean>;
}
