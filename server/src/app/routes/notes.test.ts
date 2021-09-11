import 'module-alias/register';

import { FastifyInstance } from "fastify";
import { setupEmptyApp } from '@tests/helper';

describe("/notes", () => {

	let app: FastifyInstance;

	beforeEach(async () => {
		app = await setupEmptyApp("route_notes.sqlite3");
	})

	it("GET: 200", async () => {
		const data = await app.inject("/notes");
		expect(data.statusCode).toEqual(200);
		expect(data.json()).toEqual([])
	})

	test("CREATE: 201", async () => {
		
		const newNote = {
			title: "test new note",
			content: "amazing content",
			tagsId: [],
			categoryId: null
		}

		let res = await app.inject({
			method: "POST",
			url: "/notes",
			payload: newNote
		});

		expect(res.statusCode).toEqual(201);

		const data = res.json();
		expect(data.id).not.toBeUndefined();
		console.log(typeof(data.id))
		expect(typeof(data.id) === "string").toBeTruthy();

		res = await app.inject({
			method: "GET",
			url: "/notes"
		});

		expect(res.json()).toHaveLength(1);
		expect(res.json()[0]).toHaveProperty("id");
		expect(res.json()[0]).toHaveProperty("title");
		expect(res.json()[0]).toHaveProperty("content");
		expect(res.json()[0]).toHaveProperty("tagsId");
		expect(res.json()[0]).toHaveProperty("categoryId");
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
		
		const note = {
			title: "test new note",
			content: "amazing content",
			tagsId: [],
			categoryId: null
		}

		const res = await app.inject({
			method: "POST",
			url: "/notes",
			payload: note
		});

		const noteId = res.json().id;

		const noteUpdate = {
			title: "test new note with update"
		}

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

		const data = await app.inject({
			method: "POST",
			url: `/notes/${noteId}`,
			payload: noteUpdate
		});

		expect(data.statusCode).toEqual(404);
	})

	test("DELETE: 200", async () => {

		const note = {
			title: "test new note",
			content: "amazing content",
			tagsId: [],
			categoryId: null
		}

		const res = await app.inject({
			method: "POST",
			url: "/notes",
			payload: note
		});

		const noteId = res.json().id;

		const data = await app.inject({
			method: "DELETE",
			url: `/notes/${noteId}`
		});

		expect(data.statusCode).toEqual(200);
	})

	test("DELETE: 404", async () => {

		const noteId = "7355608";

		const data = await app.inject({
			method: "DELETE",
			url: `/notes/${noteId}`
		});

		expect(data.statusCode).toEqual(404);
	})
})