import 'module-alias/register';

import App from "./app";
import SQLiteProvider from "@softwiki-core/api-providers/SQLiteProvider";

(async () => {
	
	const server = App({database: await SQLiteProvider.create("./db.sqlite3")});

	server.listen(8081, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}

		console.log(`Server listening at ${address}`);
	})
})()