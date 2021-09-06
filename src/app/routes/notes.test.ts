import App from "@app";
import SQLDatabase, { SQLDatabaseRepository, IDatabase, Note, IDatabaseRepository, Tag, Category } from "@app/database";
import { FastifyInstance } from "fastify";
import { DatabaseMock } from "@mock";

const fakeData: {notes: Note[], tags: Tag[], categories: Category[]} = {
	notes: [
		{
			id: "0",
			title: "This is a test",
			tags: ["0", "1"],
			category: undefined
		}
	],
	tags: [],
	categories: []
}

describe("route: notes", () => {

	let db: IDatabase
	let app: FastifyInstance;

	beforeEach(() => {
		db = new DatabaseMock(fakeData);
		app = App({
			database: db
		});
	})

	test("GET: 200", async () => {
		const data = await app.inject("/notes");
		expect(data.statusCode).toEqual(200);
		expect(data.json()).toEqual(fakeData.notes)
	})
})