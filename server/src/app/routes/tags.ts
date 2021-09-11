import { FastifyPluginCallback, RegisterOptions, FastifyRegister, FastifySchema } from "fastify";
import {FromSchema} from "json-schema-to-ts"
import { NoteModel, TagModel } from "@softwiki-core/api-providers/Api";
import { NoteProperties } from "@softwiki-core/objects";

const tags: FastifyPluginCallback = function (instance, opts, done) {

		instance.get("/", async (request, reply) => {
			return await instance.db.getTags();
		})
		
		const createTagSchema = {
			title: "Create tag",
			type: "object",
			required: ["name", "color"],
			properties: {
				name: {type: "string"},
				color: {
					type: "object",
					properties: {
						r: {type: "number"},
						g: {type: "number"},
						b: {type: "number"},
						a: {type: "number"}
					},
					required: ["r", "g", "b"]
				},
			},
			additionalProperties: false
		} as const;

		instance.post<{Body: FromSchema<typeof createTagSchema>}>("/", {
			schema: {
				body: createTagSchema
			}},
			async (request, reply) => {
				const tag = await instance.db.createTag({
					name: request.body.name,
					color: request.body.color
				})
				reply.code(201);
				reply.send({id: tag.id});
			})

		const updateTagSchema = {...createTagSchema, required: []}

		instance.post<{Body: FromSchema<typeof updateTagSchema>, Params: {tagId: string}}>("/:tagId", {
			schema: {
				body: updateTagSchema
			}},
			async (request, reply) => {
				await instance.db.updateTag(request.params.tagId, request.body);
				reply.code(200);
				reply.send();
			})

		instance.delete<{Params: {tagId: string}}>("/:tagId", async (request, reply) => {
			await instance.db.deleteTag(request.params.tagId);
			reply.code(200);
			reply.send();
		})

		done();
}

export default tags;