import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./DTO/create-user.dto";
import { UpdatePutUserDTO } from "./DTO/update-put-user.dto";
import { UpdatePatchUserDTO } from "./DTO/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/Interceptors/Log.interceptor";
import { ParamID } from "src/Decorators/ParamId.decorator";
import { Roles } from "src/Decorators/Roles.decorator";
import { Role } from "src/Enums/role.enums";
import { RoleGuard } from "src/Guards/role.guard";
import { AuthGuard } from "src/Guards/auth.guard";
import { ThrottlerGuard } from "@nestjs/throttler";

// * a ordem importa
@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller("users")
export class UserController {

	constructor(private readonly userService: UserService) { }

	@UseInterceptors(LogInterceptor)
	@Post()
	async Create(@Body() new_user: CreateUserDTO) {
		return this.userService.Create(new_user);
	};

	@UseGuards(ThrottlerGuard)
	@UseInterceptors(LogInterceptor)
	@Get()
	async List() {
		return this.userService.ReadAll();
	};

	@UseInterceptors(LogInterceptor)
	@Get(":id")
	async Show(@ParamID() id: number) {
		return this.userService.ReadOne(id);
	};

	@Put(":id")
	async Update(@Body() data: UpdatePutUserDTO, @ParamID() id) {
		return this.userService.UpdatePut(id, data);
	};

	@Patch(":id")
	async UpdatePartial(@Body() data: UpdatePatchUserDTO, @ParamID() id) {
		return this.userService.UpdatePatch(id, data);
	};

	@Delete(":id")
	async Delete(@ParamID() id: number) {
		return this.userService.Delete(id);
	}
}