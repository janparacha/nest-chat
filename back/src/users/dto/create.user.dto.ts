import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, isEmpty, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @Type(() => String)
    email: string;
    @ApiProperty()
    @MinLength(3)
    @Type(() => String)
    password: string;
}
