import fastify, { FastifyInstance } from "fastify";
import apap from ".";
import notes from "@app/routes/notes"
import { IDatabase } from "./database";

declare module "fastify" {
	interface FastifyInstance {
		db: IDatabase
	}
}

interface AppConfig {
	database: IDatabase
}

export default function App(config: AppConfig): FastifyInstance
{
	const server = fastify({});
	
	server.decorate("db", config.database);

	server.register(notes, {prefix: "/notes"});

	return server;
}