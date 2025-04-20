import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { UserDto } from "./dto/user.dto";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: Prisma.UserCreateInput): Promise<UserDto>;
}
