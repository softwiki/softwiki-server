import App from "@app";
import { FastifyInstance } from "fastify";

describe("route: notes", () => {

	let app: FastifyInstance;

	beforeEach(() => {
		app = App();
	})

	test("get all", async () => {
		const data = await app.inject("/notes");
		expect(data.statusCode).toEqual(200);
		expect(data.json()).toEqual([
			{},
			{}
		])
	})
})