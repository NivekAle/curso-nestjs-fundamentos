import { IsJWT, IsString, MinLength } from "class-validator";

export class AuthResetPasswordDTO {

	@MinLength(6)
	@IsString()
	password: string;

	@IsJWT()
	@IsString()
	token: string;
}