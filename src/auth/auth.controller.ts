import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Request, Response } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("log-in")
  @ApiOperation({ summary: "Log in a user" })
  @ApiResponse({ status: 201, description: "User logged in successfully." })
  @ApiResponse({
    status: 400,
    description: "Bad request or invalid credentials.",
  })
  @ApiBody({ type: LoginDto })
  async logIn(
    @Body() logInDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logIn(logInDto, res);
  }

  @Get("log-out")
  @ApiOperation({ summary: "Log out a user" })
  @ApiResponse({ status: 200, description: "User logged out successfully." })
  @ApiResponse({ status: 401, description: "Unauthorized or no session." })
  async logOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logOut(request, response);
  }

  @Get("refresh-tokens")
  @ApiOperation({ summary: "Refresh user tokens" })
  @ApiResponse({ status: 200, description: "Tokens refreshed successfully." })
  @ApiResponse({
    status: 401,
    description: "Unauthorized or invalid refresh token.",
  })
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.refreshTokens(request, response);
  }
}
