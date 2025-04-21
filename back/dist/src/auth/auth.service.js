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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signIn(data) {
        const showPassword = true;
        const user = await this.usersService.findOne(data.email, showPassword);
        if (!user) {
            throw new common_1.UnauthorizedException("L'utilisateur n'existe pas");
        }
        const isPasswordValid = this.usersService.comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Le mot de passe est incorrect");
        }
        const payload = { id: user.id, email: user.email, color: user.color };
        const token = await this.jwtService.signAsync(payload);
        return { token: token };
    }
    async verifyToken(token) {
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            return !!decoded;
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Token invalide");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map