import fastify, { FastifyInstance } from "fastify";
import notes from "@server/routes/notes"
import { Api } from "@softwiki-core";
import tags from "@server/routes/tags";

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
	const server = fastify({});
	
	server.decorate("db", config.database);

	server.register(notes, {prefix: "/notes"});
	server.register(tags, {prefix: "/tags"});
	server.register(tags, {prefix: "/categories"});

	return server;
}