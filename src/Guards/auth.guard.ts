import { CanActivate, Injectable, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { AuthService } from "src/Auth/auth.service";
import { UserService } from "src/User/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) { }

	async canActivate(context: ExecutionContext) {

		const request = context.switchToHttp().getRequest();
		const { authorization } = request.headers;

		try {
			const token_formated = (authorization ?? "").split(' ')[1];
			// console.log(token_formated);
			const data = this.authService.CheckToken(token_formated);

			request.payload = data;

			request.user = await this.userService.ReadOne(data.id);

			return true;
		}
		catch (err) {
			return false;
		}
	}
}