import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcryptjs from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../services/prisma.service";
import { UserDto } from "./dto/user.dto";
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: CreateUserDto): Promise<UserDto> {
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

    async findOne(email: string, showPassword: boolean = false): Promise<UserDto | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!showPassword) {
                return plainToInstance(UserDto, user, {
                    excludeExtraneousValues: true,
                });
            }
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateUserStatus(userId: string, isOnline: boolean) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isOnline },
        });
    }

    async updateUserColor(userId: string, color: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { color },
        });
    }

    async createMessage(data: { content: string; senderId: string; receiverId: string }) {
        return this.prisma.message.create({
            data,
            include: {
                sender: true,
                receiver: true,
            },
        });
    }

    comparePassword(inputPassword: string, userPassword: string): boolean {
        return bcryptjs.compareSync(inputPassword, userPassword);
    }
}
