import { IsEmail, IsString, MinLength } from "class-validator";
import { CreateUserDTO } from "src/User/DTO/create-user.dto";


export class AuthRegisterDTO extends CreateUserDTO { }