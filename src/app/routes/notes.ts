import { FastifyPluginCallback, RegisterOptions, FastifyRegister, FastifyPlugin } from "fastify";

const notes: FastifyPluginCallback = function (instance, opts, done) {

		instance.get("/", async (request, reply) => {
			return instance.db.notes.all();
		})
		done();
}

export default notes;