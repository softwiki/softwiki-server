import App from "./app";

const server = App();

server.listen(8081, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Server listening at ${address}`);
})