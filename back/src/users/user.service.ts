import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcryptjs from "bcryptjs";
import { PrismaService } from "../prisma.service";
import { UserDto } from "./dto/user.dto";
import { plainToInstance } from "class-transformer";
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: Prisma.UserCreateInput): Promise<UserDto> {
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(data.password, saltRounds);
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...data,
                    password: hashedPassword,
                },
            });
            return plainToInstance(UserDto, user, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
