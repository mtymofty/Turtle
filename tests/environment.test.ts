import { Environment } from "../src/interpreter/env/Environment";
import { Value } from "../src/interpreter/semantics/Value";

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

describe('Environment tests:', () => {
  test('1. Constructor test', () => {
    var env = new Environment()
    expect(env.context_stack.length).toBe(0);
  });

  test('2. >createFunCallContext', () => {
    var env = new Environment()
    env.createFunCallContext()
    expect(env.context_stack.length).toBe(1);
    expect(env.context_stack[0].scopes.length).toBe(1);
  });

  test('3. >deleteFunCallContext', () => {
    var env = new Environment()
    env.createFunCallContext()
    env.deleteFunCallContext()
    expect(env.context_stack.length).toBe(0);
  });

  test('4. >createScope', () => {
    var env = new Environment()
    env.createFunCallContext()
    env.createScope()
    expect(env.context_stack.length).toBe(1);
    expect(env.context_stack[0].scopes.length).toBe(2);
  });

  test('5. >deleteScope', () => {
    var env = new Environment()
    env.createFunCallContext()
    env.createScope()
    env.deleteScope()
    expect(env.context_stack.length).toBe(1);
    expect(env.context_stack[0].scopes.length).toBe(1);
  });

  test('6. >store', () => {
    var env = new Environment()
    env.createFunCallContext()
    env.store("var", new Value(10))
    expect(env.context_stack.length).toBe(1);
    expect(env.context_stack[0].scopes.length).toBe(1);
    expect(env.context_stack[0].scopes[0]["var"].value).toBe(10);
  });

  test('7. >find', () => {
    var env = new Environment()
    env.createFunCallContext()
    env.store("var", new Value(10))
    let val = env.find("var").value
    expect(env.context_stack.length).toBe(1);
    expect(env.context_stack[0].scopes.length).toBe(1);
    expect(val).toBe(10);
  });

});