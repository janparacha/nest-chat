import { Prisma } from "@prisma/client";
import { PrismaService } from "../services/prisma.service";
import { UserDto } from "./dto/user.dto";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: Prisma.UserCreateInput): Promise<UserDto>;
    findOne(email: string, showPassword?: boolean): Promise<UserDto | null>;
    comparePassword(inputPassword: string, userPassword: string): boolean;
}
