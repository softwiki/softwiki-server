import SQLDatabase from "@app/database";
import App from "./app";

const server = App({database: new SQLDatabase()});

server.listen(8081, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Server listening at ${address}`);
})