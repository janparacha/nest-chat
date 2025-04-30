"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs = require("bcryptjs");
const class_transformer_1 = require("class-transformer");
const prisma_service_1 = require("../services/prisma.service");
const user_dto_1 = require("./dto/user.dto");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(data) {
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(data.password, saltRounds);
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...data,
                    password: hashedPassword,
                },
            });
            return (0, class_transformer_1.plainToInstance)(user_dto_1.UserDto, user, {
                excludeExtraneousValues: true,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findOne(email, showPassword = false) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!showPassword) {
                return (0, class_transformer_1.plainToInstance)(user_dto_1.UserDto, user, {
                    excludeExtraneousValues: true,
                });
            }
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateUserStatus(userId, isOnline) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isOnline },
        });
    }
    async updateUserColor(userId, color) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { color },
        });
    }
    async createMessage(data) {
        return this.prisma.message.create({
            data,
            include: {
                sender: true,
                receiver: true,
            },
        });
    }
    comparePassword(inputPassword, userPassword) {
        return bcryptjs.compareSync(inputPassword, userPassword);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map