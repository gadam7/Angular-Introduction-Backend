import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe()) credentials: AuthDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(credentials);
  }
}
