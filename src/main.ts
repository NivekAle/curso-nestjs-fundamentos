import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { LogInterceptor } from './Interceptors/Log.interceptor';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// app.enableCors({
	// 	 methods : ["GET"],
	// 	origin : ["localhost:12345", "*"]
	// });

	app.enableCors();

	app.useGlobalPipes(new ValidationPipe());
	//	app.useGlobalInterceptors(new LogInterceptor());

	await app.listen(3000);
}
bootstrap();
