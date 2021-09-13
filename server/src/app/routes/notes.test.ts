import 'module-alias/register';

import { FastifyInstance, LightMyRequestResponse } from "fastify";
import { addTagToNoteHelper, createNoteHelper, createTagHelper, getNotesHelper, removeTagToNoteHelper, setupEmptyApp } from '@tests/helper';
import { NoteProperties } from '@softwiki-core/objects';



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

	/*test("UPDATE: 404", async () => {

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
	})*/

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

	/*test("DELETE: 404", async () => {

		const noteId = "7355608";

		const data = await app.inject({
			method: "DELETE",
			url: `/notes/${noteId}`
		});

		expect(data.statusCode).toEqual(404);
	})*/
	
	test("Adding tag: 200 & Delete tag: 200", async () => {
		const resCreateNote1 = await createNoteHelper(app, {title: "Note 1", content: "test"});
		const resCreateNote2 = await createNoteHelper(app, {title: "Note 2", content: "test"});
		const resCreateTag1 = await createTagHelper(app, {name: "Tag 1", color: {r: 255, g: 0, b: 0}});
		const resCreateTag2 = await createTagHelper(app, {name: "Tag 2", color: {r: 255, g: 0, b: 0}});

		const resAddTag = await addTagToNoteHelper(app, resCreateNote1.json().id, resCreateTag1.json().id);

		let resGet = await getNotesHelper(app);
		let data = resGet.json();

		expect(data).toHaveLength(2);

		expect(data[0].tagsId).toHaveLength(1);
		expect(data[0].tagsId[0]).toStrictEqual(resCreateTag1.json().id);

		expect(data[1].tagsId).toHaveLength(0);

		const resRemoveTag = await removeTagToNoteHelper(app, resCreateNote1.json().id, resCreateTag1.json().id);

		resGet = await getNotesHelper(app);
		data = resGet.json();

		expect(data).toHaveLength(2);

		expect(data[0].tagsId).toHaveLength(0);

		expect(data[1].tagsId).toHaveLength(0);

	})
})