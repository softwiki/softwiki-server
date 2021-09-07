import { Note } from "@app/database";
import { FastifyPluginCallback, RegisterOptions, FastifyRegister } from "fastify";

const notes: FastifyPluginCallback = function (instance, opts, done) {

		instance.get("/", async (request, reply) => {
			return await instance.db.notes.all();
		})
		
		const createNoteSchema = {
			title: "Create note",
			type: "object",
			properties: {
				title: {type: "string"},
				content: {type: "string"},
				tags: {type: "array", items: {type: "string"}},
				category: {type: "string"}
			},
			required: ["title", "content"]
		}
		
		instance.post<{Body: {}}>("/", {schema: {body: createNoteSchema}}, async (request, reply) => {
			const note = await instance.db.notes.create({title: "ez", content: "pz"})
			reply.code(201);
			reply.send(note);
		})

		const updateNoteSchema = {
			title: "Update note",
			type: "object",
			properties: {
				title: {type: "string"},
				content: {type: "string"},
				tags: {type: "array", items: {type: "string"}},
				category: {type: "string"}
			},
			required: []
		}

		instance.post<{Body: {}, Params: {noteId: string}}>("/:noteId", {schema: {body: updateNoteSchema}}, async (request, reply) => {
			if (!(await instance.db.notes.all()).find((note: Note) => note.id === request.params.noteId)) {
				reply.code(404);
				reply.send();
				return ;
			}
			reply.code(200);
			reply.send({...request.body, id: Date.now()});
		})

		instance.delete<{Body: {}, Params: {noteId: string}}>("/:noteId", async (request, reply) => {
			if (!(await instance.db.notes.all()).find((note: Note) => note.id === request.params.noteId)) {
				reply.code(404);
				reply.send();
				return ;
			}
			reply.code(200);
			reply.send({...request.body, id: Date.now()});
		})

		done();
}

export default notes;