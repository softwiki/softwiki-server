import 'module-alias/register';

import { FastifyInstance, LightMyRequestResponse } from "fastify";
import { createCategoryHelper, deleteCategoryHelper, getCategoriesHelper, setupEmptyApp, updateCategoryHelper } from '@tests/helper';
import { CategoryProperties } from '@softwiki-core/objects';

const defaultColor = {r: 1, g: 2, b: 3};

describe("/categories", () => {

	let app: FastifyInstance;

	beforeEach(async () => {
		app = await setupEmptyApp("route_categories.sqlite3");
	})

	it("GET: 200, empty", async () => {
		const res = await getCategoriesHelper(app);

		expect(res.statusCode).toEqual(200);
		expect(res.json()).toEqual([]);
	})

	it("CREATE: 201", async () => {
		const res = await createCategoryHelper(app, {name: "Category 1"});

		expect(res.statusCode).toEqual(201);
		expect(res.json()).toHaveProperty("id");
		expect(typeof(res.json().id) === "string").toBeTruthy();
		
		const resGet = await getCategoriesHelper(app);
		expect(resGet.json()).toHaveLength(1);
		expect(resGet.json()[0].id).toEqual(res.json().id);
	})

	it("CREATE: 400, missing name", async () => {
		const res = await createCategoryHelper(app, {});
		expect(res.statusCode).toEqual(400);
	})

	it("UPDATE: 200", async () => {
		const resCreate = await createCategoryHelper(app, {name: "Category 1"});
		const id = resCreate.json().id;

		const modifiedName = "Category 1 new name";
		const res = await updateCategoryHelper(app, id, {name: modifiedName});
		expect(res.statusCode).toEqual(200);

		const resGet = await getCategoriesHelper(app);
		expect(resGet.json()).toHaveLength(1);
		expect(resGet.json()[0].name).toEqual(modifiedName);
	})

	it("UPDATE: 404, unknown id", async () => {
		const modifiedName = "Category 1 new name";
		const res = await updateCategoryHelper(app, "7355608", {name: modifiedName});
		expect(res.statusCode).toEqual(404);
	})

	it("DELETE: 200", async () => {
		const resCreate = await createCategoryHelper(app, {name: "Category 1"});
		const id = resCreate.json().id;

		const res = await deleteCategoryHelper(app, id);
		expect(res.statusCode).toEqual(200);

		const resGet = await getCategoriesHelper(app);
		expect(resGet.json()).toHaveLength(0);
	})

	it("DELETE: 404, unknown id", async () => {
		const res = await deleteCategoryHelper(app, "7355608");
		expect(res.statusCode).toEqual(404);
	})
})