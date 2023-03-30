import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/Decorators/Roles.decorator";
import { Role } from "src/Enums/role.enums";

@Injectable()
export class RoleGuard implements CanActivate {

	constructor(
		private readonly reflector: Reflector
	) { }

	async canActivate(context: ExecutionContext) {

		const required_roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

		if (!required_roles) return true;

		const { user } = context.switchToHttp().getRequest();

		const rules_filtered = required_roles.filter((role) => role === user.role);

		return rules_filtered.length > 0;
	}
}