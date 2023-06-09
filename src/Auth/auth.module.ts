import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/User/user.module";
import { PrismaModule } from "src/Prisma/prisma.module";
import { FileModule } from "src/File/file.module";



@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
		}),
		forwardRef(() => UserModule),
		PrismaModule,
		FileModule
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {

};