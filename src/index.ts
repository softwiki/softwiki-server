import { SQLiteDatabase } from "@app/database";
import App from "./app";

SQLiteDatabase.create("./db.sqlite3").then((db) => {
	const server = App({database: db});

	server.listen(8081, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}

		console.log(`Server listening at ${address}`);
	})
})

