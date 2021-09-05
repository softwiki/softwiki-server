import fastify, { FastifyInstance } from "fastify";
import apap from ".";
import notes from "@app/routes/notes"

export default function App(): FastifyInstance
{
	const server = fastify({});

	server.register(notes, {prefix: "/notes"});

	return server;
}