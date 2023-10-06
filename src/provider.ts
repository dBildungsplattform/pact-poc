import {Controller, Get, Post, Query} from '@nestjs/common';
import {UserRepo} from "./user-repo";
import {User} from "./consumer";


@Controller()
export class Provider {
    constructor(private readonly userRepo: UserRepo) {}

    @Get('user')
    public getUser(@Query('id') id: number): User {
        return this.userRepo.findUser(id);
    }

    @Get('user')
    public getUserResult(@Query('id') id: number): User {
        return this.userRepo.findUser(id);
    }

    @Post('user')
    public postUser(@Query('name') name: string, @Query('password') password: string): number {
        return this.userRepo.createUser(name, password);
    }

}
