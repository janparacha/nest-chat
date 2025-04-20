import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly UserService: UserService) {}
    @Post()
    @HttpCode(201)
    // Toujours ajouter Content-Type application/json en front sinon on peut pas log le Body
    createUser(@Body() body: CreateUserDto): Promise<UserDto> {
        return this.UserService.createUser(body);
    }
}
