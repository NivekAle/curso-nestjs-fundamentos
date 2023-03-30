import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot({
			ignoreUserAgents: [/googlebot.com/gi],
			ttl: 60,
			limit: 20,
		}),
		forwardRef(() => (UserModule)),
		forwardRef(() => (AuthModule)),
		MailerModule.forRoot({
			// transport: 'smtps://celestine32@ethereal.email:faMSS7BjrVNr6Kd1Qd@smtp.ethereal.email',
			transport: {
				host: 'smtp.ethereal.email',
				port: 587,
				auth: {
					user: 'celestine32@ethereal.email',
					pass: 'faMSS7BjrVNr6Kd1Qd'
				},
				tls: {
					rejectUnauthorized: false
				}
			},
			defaults: {
				from: '"Kevin" <celestine32@ethereal.email>',
			},
			template: {
				dir: __dirname + '/templates',
				adapter: new PugAdapter(),
				options: {
					strict: true,
				},
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
	exports: [AppService]
})
export class AppModule { }