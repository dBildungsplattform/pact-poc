import {Controller, Get, Post, Query} from '@nestjs/common';
import {UserRepo} from "./user-repo";
import {User} from "./consumer";


@Controller()
export class Provider {
    constructor(private readonly userRepo: UserRepo) {}

    @Get('user')
    public getUser(@Query('id') id: number, @Query('id2') id2: number): User {
        console.log(`got id:${id} in provideUser`);
        return this.userRepo.findUser(id);
    }

    @Post('user')
    public postUser(@Query('name') name: string, @Query('password') password: string): number {
        console.log(`got name:${name} and password:${password} in postUser`);
        return this.userRepo.createUser(name, password);
    }

}
