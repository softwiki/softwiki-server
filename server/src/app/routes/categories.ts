import { FastifyPluginCallback, RegisterOptions, FastifyRegister, FastifySchema } from "fastify";
import {FromSchema} from "json-schema-to-ts"
import { NoteModel, TagModel } from "@softwiki-core/api-providers/Api";
import { NoteProperties } from "@softwiki-core/objects";

const categories: FastifyPluginCallback = function (instance, opts, done) {

		instance.get("/", async (request, reply) => {
			return await instance.db.getCategories();
		})
		
		const createCategorySchema = {
			title: "Create category",
			type: "object",
			required: ["name"],
			properties: {
				name: {type: "string"},
			},
			additionalProperties: false
		} as const;

		instance.post<{Body: FromSchema<typeof createCategorySchema>}>("/", {
			schema: {
				body: createCategorySchema
			}},
			async (request, reply) => {
				const category = await instance.db.createCategory({
					name: request.body.name
				})
				reply.code(201);
				reply.send({id: category.id});
			})

		const updateCategorySchema = {...createCategorySchema, required: []}

		instance.post<{Body: FromSchema<typeof updateCategorySchema>, Params: {categoryId: string}}>("/:categoryId", {
			schema: {
				body: updateCategorySchema
			}},
			async (request, reply) => {
				await instance.db.updateCategory(request.params.categoryId, request.body);
				reply.code(200);
				reply.send();
			})

		instance.delete<{Params: {categoryId: string}}>("/:categoryId", async (request, reply) => {
			await instance.db.deleteCategory(request.params.categoryId);
			reply.code(200);
			reply.send();
		})

		done();
}

export default categories;