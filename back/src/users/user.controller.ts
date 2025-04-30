import { Body, Controller, HttpCode, Post, Put, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from '../auth/auth.guard';

@Controller("user")
export class UserController {
    constructor(private readonly UserService: UserService) {}
    @Post()
    @HttpCode(201)
    // Toujours ajouter Content-Type application/json en front sinon on peut pas log le Body
    createUser(@Body() body: CreateUserDto): Promise<UserDto> {
        return this.UserService.createUser(body);
    }

    @UseGuards(AuthGuard)
    @Put('profile/color')
    async updateColor(@Request() req, @Body() data: { color: string }) {
        return this.UserService.updateUserColor(req.user.id, data.color);
    }
}
