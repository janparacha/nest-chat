import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create.user.dto";
import { UserService } from "../users/user.service";
import { UserDto } from "src/users/dto/user.dto";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(private usersService: UserService, private readonly jwtService: JwtService) {}

    async signIn(data: CreateUserDto): Promise<any> {
        const showPassword = true;
        const user = await this.usersService.findOne(data.email, showPassword);
        if (!user) {
            throw new UnauthorizedException("L'utilisateur n'existe pas");
        }
        const isPasswordValid = this.usersService.comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Le mot de passe est incorrect");
        }
        const payload = { id: user.id, email: user.email, color: user.color };
        const token = await this.jwtService.signAsync(payload);
        return { token: token };
    }

    async verifyToken(token: string): Promise<Boolean> {
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            return !!decoded;
        } catch (error) {
            throw new UnauthorizedException("Token invalide");
        }
    }

    async decodeToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new UnauthorizedException("Token invalide");
        }
    }
}
