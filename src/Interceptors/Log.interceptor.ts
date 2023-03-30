import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

// ! FS
// import fs from "fs";


export class LogInterceptor implements NestInterceptor {

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

		const time_stamp = Date.now();

		var fs = require("fs");

		return next.handle().pipe(
			tap(() => {
				// TODO 👇 : Implementar um sistema de "logs", onde a cada dia que passar criar um novo arquivo (txt) e inserir os logs.
				// @ref 1 : https://stackoverflow.com/questions/16536093/how-to-create-file-according-to-date
				// @ref 2 : https://parallelcodes.com/node-js-how-to-create-write-and-read-file/

				const res = context.switchToHttp().getRequest();
				var text_to_file = `Method : ${res.method} \rURL/URI : ${res.url}\rTime : ${Date.now() - time_stamp} ms \rDate : ${(new Date(time_stamp)).toLocaleDateString()} - ${(new Date().getHours())}:${(new Date().getMinutes())}:${(new Date().getSeconds())} \r-------------\r`;

				fs.appendFile("src/Logs/logs.txt", text_to_file, err => {
					if (err) console.log(err);
				});
			})
		);
	}
}
