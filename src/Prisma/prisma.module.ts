import { Module } from "@nestjs/common";
import { PrismaService } from "./Prisma.service";


@Module({
	imports: [],
	controllers: [],
	providers: [PrismaService],
	exports: [PrismaService]
})
export class PrismaModule { }