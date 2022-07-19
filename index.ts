import consola from 'consola';
import { setupServer } from "msw/node";
import { rest } from "msw";
import ky from "ky"
import fetch from "node-fetch";

const TEST_URL = `http://localhost/test`;
const handlers = [
  rest.get(TEST_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ test: true }));
  }),
];
const server = setupServer(...handlers);

(async () => {
  server.listen({ onUnhandledRequest: "error" });
  // Native fetch
  try {
    consola.info(`Native Fetch`)
    const res = await globalThis.fetch(TEST_URL);
    const json = await res.json();
    consola.success( json );
  } catch (error) {
    consola.error(`Native Fetch failed`)
    console.log(error);
  }
  // Ky
  try {
    consola.info(`Ky`)
    const json = await ky(TEST_URL).json();
    consola.success( json );
  } catch (error) {
    consola.error(`ky failed`)
    console.log(error);
  }
  // node-fetch
  try {
    consola.info(`node-fetch`)
    const res = await fetch(TEST_URL);
    const json = await res.json();
    consola.success( json );
  } catch (error) {
    consola.error(`node-fetch failed`)
    console.log(error);
  }
  server.close();
})();
