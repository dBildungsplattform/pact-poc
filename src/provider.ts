import {Controller, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common';
import {UserRepo} from "./user-repo";
import {User} from "./consumer";
import {ApiInternalServerErrorResponse, ApiNotFoundResponse} from "@nestjs/swagger";


@Controller()
export class Provider {
    constructor(private readonly userRepo: UserRepo) {}

    @Get('user')
    @ApiNotFoundResponse({description: 'No user for this id!'})
    public getUser(@Query('id') id: number): User {
        const user = this.userRepo.findUser(id);
        if(user == undefined) {
            throw new HttpException('Forbidden', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Post('user')
    @ApiInternalServerErrorResponse({ description: 'Internal server error while creating the person.' })
    public postUser(@Query('name') name: string, @Query('password') password: string): number {
        if(name === 'Dieter') {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return this.userRepo.createUser(name, password);
    }

}
