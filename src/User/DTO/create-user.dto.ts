import { IsString, IsEmail, IsStrongPassword, IsOptional, IsDateString, IsEnum } from "class-validator";
import { Role } from "src/Enums/role.enums";


export class CreateUserDTO {

	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsStrongPassword({
		minLength: 6,
		minNumbers: 0,
		minUppercase: 0,
		minSymbols: 0,
		minLowercase: 0
	})
	password: string;

	@IsOptional()
	@IsDateString()
	birthDay: string;

	@IsOptional()
	@IsEnum(Role)
	role: number;
}