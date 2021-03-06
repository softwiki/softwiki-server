import App from "@server";
import SQLiteProvider from "@softwiki-core/api-providers/SQLiteProvider";
import { CategoryProperties, NoteProperties, TagProperties } from "@softwiki-core/objects";
import { FastifyInstance, LightMyRequestResponse } from "fastify";
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

const NOTES_BASE_URL = "/notes"

export async function getNotesHelper(app: FastifyInstance): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "GET",
		url: `${NOTES_BASE_URL}`
	})
}

export async function createNoteHelper(app: FastifyInstance, properties: Partial<NoteProperties>): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "POST",
		url: `${NOTES_BASE_URL}`,
		payload: properties
	})
}

export async function updateNoteHelper(app: FastifyInstance, id: string, properties: Partial<NoteProperties>): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "POST",
		url: `${NOTES_BASE_URL}/${id}`,
		payload: properties
	})
}

export async function deleteNoteHelper(app: FastifyInstance, id: string): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "DELETE",
		url: `${NOTES_BASE_URL}/${id}`
	})
}

export async function addTagToNoteHelper(app: FastifyInstance, noteId: string, tagId: string): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "POST",
		url: `${NOTES_BASE_URL}/${noteId}/tags`,
		payload: {tagId}
	})
}

export async function removeTagToNoteHelper(app: FastifyInstance, noteId: string, tagId: string): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "DELETE",
		url: `${NOTES_BASE_URL}/${noteId}/tags`,
		payload: {tagId}
	})
}

const TAGS_BASE_URL = "/tags"

export async function getTagsHelper(app: FastifyInstance): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "GET",
		url: `${TAGS_BASE_URL}`
	})
}

export async function createTagHelper(app: FastifyInstance, properties: Partial<TagProperties>): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "POST",
		url: `${TAGS_BASE_URL}`,
		payload: properties
	})
}

export async function updateTagHelper(app: FastifyInstance, id: string, properties: Partial<TagProperties>): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "POST",
		url: `${TAGS_BASE_URL}/${id}`,
		payload: properties
	})
}

export async function deleteTagHelper(app: FastifyInstance, id: string): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "DELETE",
		url: `${TAGS_BASE_URL}/${id}`
	})
}

const CATEGORIES_BASE_URL = "/categories"

export async function getCategoriesHelper(app: FastifyInstance): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "GET",
		url: `${CATEGORIES_BASE_URL}`
	})
}

export async function createCategoryHelper(app: FastifyInstance, properties: Partial<CategoryProperties>): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "POST",
		url: `${CATEGORIES_BASE_URL}`,
		payload: properties
	})
}

export async function updateCategoryHelper(app: FastifyInstance, id: string, properties: Partial<CategoryProperties>): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "POST",
		url: `${CATEGORIES_BASE_URL}/${id}`,
		payload: properties
	})
}

export async function deleteCategoryHelper(app: FastifyInstance, id: string): Promise<LightMyRequestResponse> {
	return await app.inject({
		method: "DELETE",
		url: `${CATEGORIES_BASE_URL}/${id}`
	})
}