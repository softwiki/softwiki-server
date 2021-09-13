import fastify, { FastifyInstance } from "fastify";
import notes from "@server/routes/notes"
import { Api } from "@softwiki-core";
import tags from "@server/routes/tags";
import fastifyCors from "fastify-cors"
import categories from "./routes/categories";

declare module "fastify" {
	interface FastifyInstance {
		db: Api
	}
}

interface AppConfig {
	database: Api
}

export default function App(config: AppConfig): FastifyInstance
{
	const server = fastify({logger: false});

	server.register(fastifyCors, {
		origin: "*"
	});
	
	server.decorate("db", config.database);

	server.register(notes, {prefix: "/notes"});
	server.register(tags, {prefix: "/tags"});
	server.register(categories, {prefix: "/categories"});

	return server;
}