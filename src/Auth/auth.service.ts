import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/Prisma/Prisma.service";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";
import { UserService } from "src/User/user.service";
import * as bcrypt from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {

	private readonly _audience: string = "Users";
	private readonly _issuer: string = "Login";

	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly mailerService: MailerService
	) { }

	CreateToken(user: User) {
		return {
			token: this.jwtService.sign({
				id: user.id,
				name: user.name
			}, {
				expiresIn: "2h",
				subject: String(user.id),
				audience: this._audience,
				issuer: this._issuer
			}
			)
		}
	};

	CheckToken(token: string) {
		try {
			const data = this.jwtService.verify(token, {
				audience: this._audience,
				issuer: this._issuer
			});

			return data;

		} catch (err) {
			throw new BadRequestException(err);
		}

	};

	IsValidToken(token: string) {
		try {
			this.CheckToken(token);
			return true;
		} catch (error) {
			return false;
		}
	}

	async Login(email: string, password: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email
			}
		});

		if (!user) {
			throw new UnauthorizedException("Email ou Senha incorretos!");
		}

		if (!await bcrypt.compare(password, user.password)) {
			throw new UnauthorizedException("Email ou Senha incorretos!"); // no caso a senha
		}

		return this.CreateToken(user);
	};

	async ForgetPassword(email: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email
			}
		});

		if (!user) {
			throw new UnauthorizedException("Email está incorreto!");
		}

		const token = this.jwtService.sign({
			id: user.id,

		}, {
			expiresIn: "20 minutes",
			subject: String(user.id),
			audience: "Users",
			issuer: "Forget"
		});

		// TODO : Enviar o e-mail...
		await this.mailerService.sendMail(
			{
				subject: "Recuperação de Senha",
				to: "kevincscz15@gmail.com",
				template: `forget`,
				context: {
					name: user.name,
					token,
				}
			}
		)

		return true;
	};

	async Reset(new_password: string, token: string) {

		try {
			const data = this.jwtService.verify(token, {
				audience: "Users",
				issuer: "Forget"
			});
			if (isNaN(Number(data.id))) {
				throw new HttpException("Token inválido", HttpStatus.BAD_REQUEST);
			}

			// TODO : validar o token,

			const salt = await bcrypt.genSalt();
			new_password = await bcrypt.hash(new_password, salt);

			const user = await this.prisma.user.update({
				where: {
					id: Number(data.id),
				},
				data: {
					password: new_password
				}
			});

			return this.CreateToken(user);

		} catch (err) {
			throw new BadRequestException(err);
		}

	};

	async Register(data: AuthRegisterDTO) {
		const user = await this.userService.Create(data);

		return this.CreateToken(user);
	}

};