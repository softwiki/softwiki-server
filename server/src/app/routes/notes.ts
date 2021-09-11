import { FastifyPluginCallback, RegisterOptions, FastifyRegister, FastifySchema } from "fastify";
import {FromSchema} from "json-schema-to-ts"
import { NoteModel } from "@softwiki-core/api-providers/Api";
import { NoteProperties } from "@softwiki-core/objects";

function fillNote(note: Partial<NoteProperties>): NoteProperties {
	return {
		title: "",
		content: "",
		tagsId: [],
		categoryId: undefined,
		...note
	}
}

const notes: FastifyPluginCallback = function (instance, opts, done) {

		instance.get("/", async (request, reply) => {
			return await instance.db.getNotes();
		})
		
		const createNoteSchema = {
			title: "Create note",
			type: "object",
			required: ["title", "content"],
			properties: {
				title: {type: "string"},
				content: {type: "string"},
				tagsId: {type: "array", items: {type: "string"}},
				categoryId: {type: ["string"]}
			},
			additionalProperties: false
		} as const;

		instance.post<{Body: FromSchema<typeof createNoteSchema>}>("/", {
			schema: {
				body: createNoteSchema
			}},
			async (request, reply) => {
				const note = await instance.db.createNote(fillNote(request.body))
				reply.code(201);
				reply.send({id: note.id});
			})

		const updateNoteSchema = {...createNoteSchema, required: []}

		instance.post<{Body: FromSchema<typeof updateNoteSchema>, Params: {noteId: string}}>("/:noteId", {
			schema: {
				body: updateNoteSchema
			}},
			async (request, reply) => {
				if (!(await instance.db.getNotes()).find((note: NoteModel) => note.id === request.params.noteId)) {
					reply.code(404);
					reply.send();
					return ;
				}
				reply.code(200);
				reply.send({...request.body, id: Date.now()});
			})

		instance.delete<{Params: {noteId: string}}>("/:noteId", async (request, reply) => {
			if (!(await instance.db.getNotes()).find((note: NoteModel) => note.id === request.params.noteId)) {
				reply.code(404);
				reply.send();
				return ;
			}
			reply.code(200);
			reply.send();
		})

		done();
}

export default notes;