'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { build } = require('../helper');

test('example is loaded', async (t) => {
  const app = await build(t);

  const res = await app.inject({
    method: 'POST',
    url: '/example/create',
    body: {
      id: {
        mimetype: 'text/plain',
        value: '1',
      },
      file: {
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        toBuffer: () => {}, // Here I can't send a mock function
      },
    },
  });

  // As you can see, it does not recognize the toBuffer and requires it to be mandatory even though it is Type.Any() in the scheme.
  const expected = {
    statusCode: 400,
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: "body/file must have required property 'toBuffer'",
  };

  const body = JSON.parse(res.body);
  assert.deepEqual(body, expected);
});
