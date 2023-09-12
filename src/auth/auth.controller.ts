import { Body, Post, Controller, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @Post('/signup') //ValidationPipe는 auth-credentials.dto.ts에 있는 유효성 검사
    signUp(@Body(ValidationPipe) authcredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authcredentialsDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard()) // get-user.decorator.ts가 있어야 가능
    test(@GetUser() user:User) {
        console.log('user', user)
    }

}
