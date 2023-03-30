import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./DTO/create-user.dto";
import { PrismaService } from "src/Prisma/Prisma.service";
import { UpdatePutUserDTO } from "./DTO/update-put-user.dto";
import { UpdatePatchUserDTO } from "./DTO/update-patch-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

	constructor(private readonly prisma: PrismaService) { }

	async Create(new_user: CreateUserDTO) {

		const salt = await bcrypt.genSalt();

		new_user.password = await bcrypt.hash(new_user.password, salt);

		return this.prisma.user.create({ data: new_user });
	};

	async ReadAll() {
		return this.prisma.user.findMany();
	};

	async ReadOne(id: number) {

		await this.UserExists(id);

		return this.prisma.user.findUnique({
			where: { id }
		});
	};

	async UpdatePut(id: number, { email, name, password, birthDay, role }: UpdatePutUserDTO) {

		await this.UserExists(id);

		const salt = await bcrypt.genSalt();

		password = await bcrypt.hash(password, salt);

		return this.prisma.user.update({
			data: {
				email,
				name,
				password,
				birthDay: birthDay ? new Date(birthDay) : null,
				role,
			},
			where: {
				id
			}
		});
	}

	async UpdatePatch(id: number, { email, name, password, birthDay, role }: UpdatePatchUserDTO) {

		await this.UserExists(id);

		const data: any = {};

		if (birthDay) {
			data.birthDay = new Date(birthDay).toISOString();
		}

		if (email) {
			data.email = email;
		}

		if (name) {
			data.name = name;
		}

		if (password) {
			data.password = password;
			const salt = await bcrypt.genSalt();

			data.password = await bcrypt.hash(password, salt);
		}

		if (role) {
			data.role = role;
		}

		return this.prisma.user.update({
			data,
			where: {
				id
			}
		});
	}

	async Delete(id: number) {

		await this.UserExists(id);

		return this.prisma.user.delete({
			where: {
				id
			}
		});
	}

	async UserExists(id: number) {

		if (!(await this.prisma.user.count({ where: { id } }))) {
			throw new NotFoundException(`O Usuário com o id => ${id} não foi encontrado.`);
		}

	}
}
