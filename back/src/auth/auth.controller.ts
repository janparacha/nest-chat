import { Body, Controller, Get, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create.user.dto";
import { UserService } from "src/users/user.service";
import { AuthService } from "./auth.service";
import { UserDto } from "src/users/dto/user.dto";

@Controller("")
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}
    @Post("login")
    async login(@Body() data: CreateUserDto) {
        return this.authService.signIn(data);
    }

    @Post("register")
    async register(@Body() data: CreateUserDto) {
        return this.userService.createUser(data);
    }

    @Get("verify")
    async verifyToken(@Headers("authorization") authHeader: string) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid token format");
        }
        const token = authHeader.replace("Bearer ", "").trim();

        return this.authService.verifyToken(token);
    }

    // @UseGuards(AuthGuard)
    // @Get("profile")
    // getProfile(@Request() req) {
    //     return req.user;
    // }
}
