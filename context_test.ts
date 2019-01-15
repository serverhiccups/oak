import {
  test,
  assert,
  assertEqual
} from "https://deno.land/x/std/testing/mod.ts";
import { Application } from "./application.ts";
import { Context } from "./context.ts";
import { ServerRequest } from "./deps.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import httpError from "./httpError.ts";

function createMockApp<S extends object = { [key: string]: any }>(
  state = {} as S
): Application<S> {
  return {
    state
  } as any;
}

function createMockServerRequest(url = "/"): ServerRequest {
  const headers = new Headers();
  return {
    headers,
    method: "GET",
    url,
    async respond() {}
  } as any;
}

test(function context() {
  const app = createMockApp();
  const serverRequest = createMockServerRequest();
  const context = new Context(app, serverRequest);
  assert(context instanceof Context);
  assert(context.state === app.state);
  assert(context.app === app);
  assert(context.request instanceof Request);
  assert(context.response instanceof Response);
});

test(function contextThrows() {
  let didThrow = false;
  const context = new Context(createMockApp(), createMockServerRequest());
  try {
    context.throw(404, "foobar", { foo: "bar" });
  } catch (e) {
    assert(e instanceof httpError.NotFound);
    assertEqual(e.message, "foobar");
    assertEqual(e.foo, "bar");
    didThrow = true;
  }
  assert(didThrow);
});
