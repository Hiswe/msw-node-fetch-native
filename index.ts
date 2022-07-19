import { setupServer } from "msw/node";
import { rest } from "msw";
import ky from "ky"
import fetch from "node-fetch";

const TEST_URL = `http://localhost/test`;
const handlers = [
  rest.get(TEST_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];
const server = setupServer(...handlers);

(async () => {
  server.listen({ onUnhandledRequest: "error" });
  // Native fetch
  try {
    console.log(`Native Fetch`)
    const res = await globalThis.fetch(TEST_URL);
    const json = await res.json();
    console.log({ json });
  } catch (error) {
    console.log(`Native Fetch failed`)
    console.log(error);
  }
  // Ky
  try {
    console.log(`Ky`)
    const json = await ky(TEST_URL);
    console.log({ json });
  } catch (error) {
    console.log(`ky failed`)
    console.log(error);
  }
  // node-fetch
  try {
    console.log(`node-fetch`)
    const res = await fetch(TEST_URL);
    const json = await res.json();
    console.log({ json });
  } catch (error) {
    console.log(`node-fetch failed`)
    console.log(error);
  }
  server.close();
})();
