import App from "@app";
import { SQLiteDatabase, SQLiteDatabaseRepository, IDatabase, Note, IDatabaseRepository, Tag, Category } from "@app/database";
import { FastifyInstance } from "fastify";
import { DatabaseMock } from "@mock";
import { threadId } from "worker_threads";

const fakeData: {notes: Note[], tags: Tag[], categories: Category[]} = {
	notes: [
		{
			id: "0",
			title: "This is a test",
			content: "ez",
			tags: ["0", "1"],
			category: undefined
		}
	],
	tags: [],
	categories: []
}

describe("route: notes", () => {

	let db: DatabaseMock
	let app: FastifyInstance;

	beforeEach(() => {
		db = new DatabaseMock(fakeData);
		app = App({
			database: db
		});
	})

	test("GET: 200", async () => {
		db.notes.addMockReturn(fakeData.notes)
		const data = await app.inject("/notes");
		expect(data.statusCode).toEqual(200);
		expect(data.json()).toEqual(fakeData.notes)
	})

	test("CREATE: 201", async () => {
		
		const newNote = {
			title: "test new note",
			content: "amazing content",
			tags: [],
			category: undefined
		}

		const mockReturnValue = {...newNote, id: 42}
		db.notes.addMockReturn(mockReturnValue)

		const res = await app.inject({
			method: "POST",
			url: "/notes",
			payload: newNote
		});

		expect(res.statusCode).toEqual(201);

		const data = res.json();
		expect(data.id).not.toBeUndefined();
		expect(data).toEqual(mockReturnValue)
	})

	test("CREATE: 400", async () => {

		const newNote = {
			title: "test new note",
			tags: []
		}

		const data = await app.inject({
			method: "POST",
			url: "/notes",
			payload: newNote
		});

		expect(data.statusCode).toEqual(400);
	})

	test("UPDATE: 200", async () => {

		const noteId = "0";
		const noteUpdate = {
			title: "test new note with update"
		}

		db.notes.addMockReturn(fakeData.notes)

		const data = await app.inject({
			method: "POST",
			url: `/notes/${noteId}`,
			payload: noteUpdate
		});

		expect(data.statusCode).toEqual(200);
	})

	test("UPDATE: 404", async () => {

		const noteId = "7355608";
		const noteUpdate = {
			title: "test new note with update"
		}

		db.notes.addMockReturn(fakeData.notes)
		const data = await app.inject({
			method: "POST",
			url: `/notes/${noteId}`,
			payload: noteUpdate
		});

		expect(data.statusCode).toEqual(404);
	})

	test("DELETE: 200", async () => {

		const noteId = "0";

		db.notes.addMockReturn(fakeData.notes)
		const data = await app.inject({
			method: "DELETE",
			url: `/notes/${noteId}`
		});

		expect(data.statusCode).toEqual(200);
	})

	test("DELETE: 404", async () => {

		const noteId = "7355608";

		db.notes.addMockReturn(fakeData.notes)
		const data = await app.inject({
			method: "DELETE",
			url: `/notes/${noteId}`
		});

		expect(data.statusCode).toEqual(404);
	})
})