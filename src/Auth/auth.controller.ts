import { Body, Controller, Post, Headers, UseGuards, Request, UseInterceptors, UploadedFile, HttpException, HttpStatus, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { AuthLoginDTO } from "./DTO/auth-login.dto";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";
import { AuthForgetDTO } from "./DTO/auth-forget.dto";
import { AuthResetPasswordDTO } from "./DTO/auth-reset-password.dto";
import { UserService } from "src/User/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/Guards/auth.guard";
import { UserAuth } from "src/Decorators/UserDecorator.decorator";
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/File/file.service";

@Controller("auth")
export class AuthController {

	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
		private readonly fileService: FileService
	) { }


	@Post("login")
	async Login(@Body() { email, password }: AuthLoginDTO) {
		return this.authService.Login(email, password);
	}

	@Post("register")
	async Register(@Body() body: AuthRegisterDTO) {
		return this.authService.Register(body);
	}

	@Post("forget")
	async Forget(@Body() { email }: AuthForgetDTO) {
		return this.authService.ForgetPassword(email);
	}

	@Post("reset")
	async ResetPassword(@Body() { password, token }: AuthResetPasswordDTO) {
		return this.authService.Reset(password, token);
	}

	@UseGuards(AuthGuard)
	@Post("me")
	async me(@UserAuth() user) {
		return user;
	}

	@UseInterceptors(FileInterceptor("file"))
	@UseGuards(AuthGuard)
	@Post("photo")
	async uploadPhoto(@UserAuth() user, @UploadedFile(new ParseFilePipe({
		validators: [
			new FileTypeValidator({ fileType: "image/png" }),
			new MaxFileSizeValidator({maxSize : 1024 * 40 })
		]
	})) photo: Express.Multer.File) {
		const path = join(__dirname, "../", "../", "storage", "photos", `photo-${user.id}.jpg`);

		try {
			await this.fileService.upload(photo, path);
		} catch (error) {
			throw new HttpException(error, 400, { description: "Erro ao fazer o upload" });

		}

		return { photo }
	}

	@UseInterceptors(FilesInterceptor("files"))
	@UseGuards(AuthGuard)
	@Post("files")
	async uploadFiles(@UserAuth() user, @UploadedFiles() files: Express.Multer.File[]) {

		return files;
	}

	@UseInterceptors(FileFieldsInterceptor([
		{
			name: "photo",
			maxCount: 1
		},
		{
			name: "documents",
			maxCount: 3
		}
	]))
	@UseGuards(AuthGuard)
	@Post("files-fields")
	async uploadFilesFields(
		@UserAuth() user,
		@UploadedFiles() { photo, documents }: {
			photo: Express.Multer.File, documents: Express.Multer.File[]
		}) {

		return { photo, documents };
	}

}