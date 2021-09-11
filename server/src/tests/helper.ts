import App from "@server";
import SQLiteProvider from "@softwiki-core/api-providers/SQLiteProvider";
import { FastifyInstance } from "fastify";
import fs from "fs/promises";

export async function setupEmptyApp(testName: string): Promise<FastifyInstance>
{
	await fs.rm(testName, {force: true});
	const db = await SQLiteProvider.create(testName);
	const app = App({
		database: db
	});
	return app
}