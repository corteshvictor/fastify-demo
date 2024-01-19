const multipart = require('@fastify/multipart');
const { Type } = require('@fastify/type-provider-typebox');

module.exports = async function (fastify, opts) {
  fastify.register(multipart, { attachFieldsToBody: true });

  fastify.route({
    url: '/create',
    method: 'POST',
    schema: {
      body: Type.Object({
        id: Type.Object({
          mimetype: Type.String(),
          value: Type.String(),
        }),
        file: Type.Object({
          filename: Type.String(),
          mimetype: Type.String(),
          toBuffer: Type.Any(),
        }),
      }),
    },
    handler: async function (request, reply) {
      const { id, file } = request.body;

      try {
        // I need the mock function to arrive so I can use returning something false from toBuffer.
        const buffer = await file.toBuffer();

        //I need to create this blob because I send it to another endpoint to upload the file that arrives.
        const blob = new Blob([buffer], { type: file.mimetype });

        return { id, blob };
      } catch (error) {
        fastify.log.error(error);
      }
    },
  });
};
