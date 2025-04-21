import { Exclude, Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    color: string;

    @Expose()
    isOnline: boolean;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}
