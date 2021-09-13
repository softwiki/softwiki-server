import 'module-alias/register';

import { FastifyInstance, LightMyRequestResponse } from "fastify";
import { createTagHelper, deleteTagHelper, getTagsHelper, setupEmptyApp, updateTagHelper } from '@tests/helper';
import { TagProperties } from '@softwiki-core/objects';

const defaultColor = {r: 1, g: 2, b: 3};

describe("/tags", () => {

	let app: FastifyInstance;

	beforeEach(async () => {
		app = await setupEmptyApp("route_tags.sqlite3");
	})

	it("GET: 200, empty", async () => {
		const res = await getTagsHelper(app);

		expect(res.statusCode).toEqual(200);
		expect(res.json()).toEqual([]);
	})

	it("CREATE: 201", async () => {
		const res = await createTagHelper(app, {name: "Tag 1", color: defaultColor});

		expect(res.statusCode).toEqual(201);
		expect(res.json()).toHaveProperty("id");
		expect(typeof(res.json().id) === "string").toBeTruthy();
		
		const resGet = await getTagsHelper(app);
		expect(resGet.json()).toHaveLength(1);
		expect(resGet.json()[0].id).toEqual(res.json().id);
	})

	it("CREATE: 400, missing name", async () => {
		const res = await createTagHelper(app, {color: defaultColor});
		expect(res.statusCode).toEqual(400);
	})

	it("CREATE: 400, missing color", async () => {
		const res = await createTagHelper(app, {name: "Tag 1"});

		expect(res.statusCode).toEqual(400);
	})

	it("UPDATE: 200", async () => {
		const resCreate = await createTagHelper(app, {name: "Tag 1", color: defaultColor});
		const id = resCreate.json().id;

		const modifiedName = "Tag 1 new name";
		const res = await updateTagHelper(app, id, {name: modifiedName});
		expect(res.statusCode).toEqual(200);

		const resGet = await getTagsHelper(app);
		expect(resGet.json()).toHaveLength(1);
		expect(resGet.json()[0].name).toEqual(modifiedName);
	})

	/*it("UPDATE: 404, unknown id", async () => {
		const modifiedName = "Tag 1 new name";
		const res = await updateTagHelper(app, "7355608", {name: modifiedName});
		expect(res.statusCode).toEqual(404);
	})*/

	it("DELETE: 200", async () => {
		const resCreate = await createTagHelper(app, {name: "Tag 1", color: defaultColor});
		const id = resCreate.json().id;

		const res = await deleteTagHelper(app, id);
		expect(res.statusCode).toEqual(200);

		const resGet = await getTagsHelper(app);
		expect(resGet.json()).toHaveLength(0);
	})

	/*it("DELETE: 404, unknown id", async () => {
		const res = await deleteTagHelper(app, "7355608");
		expect(res.statusCode).toEqual(404);
	})*/
})