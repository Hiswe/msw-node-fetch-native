import consola from 'consola'
import { MockAgent, setGlobalDispatcher } from "undici";
import type {
  Interceptable,
  MockInterceptor,
} from "undici/types/mock-interceptor";
import ky from "ky"
import fetch from "node-fetch";

let mockAgent: MockAgent;
let mockPool: Interceptable;
const responseOptions: MockInterceptor.MockResponseOptions = {
  headers: {
    "content-type": "application/json",
  },
};
const TEST_URL = `http://localhost/test`;

(async () => {
  mockAgent = new MockAgent();
  mockAgent.disableNetConnect(); // prevent actual requests to be done
  setGlobalDispatcher(mockAgent); // enabled the mock client to intercept requests

  mockPool = mockAgent.get("http://localhost");

  mockPool
    .intercept({
      path: "/test",
      method: "GET",
    })
    .reply(() => ({
      data: { test: true },
      statusCode: 200,
      responseOptions,
    }));


  // Native fetch
  try {
    consola.info(`Native Fetch`)
    const res = await globalThis.fetch(TEST_URL);
    const json = await res.json();
    consola.success(json);
  } catch (error) {
    consola.error(`Native Fetch failed`)
    console.log(error);
  }

  // Ky
  mockPool
    .intercept({
      path: "/test",
      method: "GET",
    })
    .reply(() => ({
      data: { test: true },
      statusCode: 200,
      responseOptions,
    }));
  try {
    consola.info(`Ky`)
    const json = await ky(TEST_URL).json();
    consola.success(json);
  } catch (error) {
    consola.error(`ky failed`)
    console.log(error);
  }

  // node-fetch
  try {
    consola.info(`node-fetch`)
    const res = await fetch(TEST_URL);
    const json = await res.json();
    consola.success({ json });
  } catch (error) {
    consola.error(`node-fetch failed`)
    console.log(error);
  }

  await mockAgent.close();
})();
