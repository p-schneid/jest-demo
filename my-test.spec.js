import axios from "axios";

// // Don't do this!

test("Test 1", () => {
  function callback(data) {
    expect(0).toBe(0);
  }

  setTimeout(callback, 5000);
});

// Jest is opimistic. If no assertions, it will actually return true.

// Asynchronous tests:

// 3 common patterns

// Callbacks
// If using callbacks to handle asyncronous behavior. setTimeout, onChange, etc..

test("Test 2", done => {
  function callback(data) {
    try {
      expect(0).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  }
  expect(0).toBeFalsy();
  expect(0).toBeFalsy();

  setTimeout(callback, 5000);
});

// if done is never called, the test will fail. ( timout error. If you want more descriptive error messageing, you need to pass)

// Tests with Promises. If tests return a promise, Jest will resolve any asertions in your then callback. If the promise fails, the test will automatically fail

// If you expect a promise to be rejected use the .catch method.
//**** Make sure to add expect.assertions to verify that a certain number of assertions are called. Otherwise a fulfilled promise would not fail the test.
const myPromise = () => {
  return new Promise((resolve, reject) => {
    resolve("success");
  });
};

const myRejectPromise = () => {
  return new Promise((resolve, reject) => {
    reject("error");
  });
};

const myAsyncFunc = async () => {
  throw "error";
};

test("Test 3", () => {
  //expect.assertions(1);
  return myRejectPromise().catch(e => {
    expect(e).toMatch("error");
  });
});

// Tests with Async/Await

test("Test 4", async () => {
  const data = await myPromise();
  expect(data).toBe("success");
});

test("Test 5", async () => {
  try {
    await myAsyncFunc();
  } catch (e) {
    expect(e).toMatch("error");
  }
});

describe("Test suite 1", () => {
  beforeAll(() => console.log("Before all tests in suite 1"));
  afterAll(() => console.log("After all tests in suite 1"));

  it("Test 6", () => {
    console.log("Test 6");
    expect(1).toBeGreaterThan(0);
  });

  it("Test 7", () => {
    console.log("Test 7");
    expect(2).toBeGreaterThan(1);
  });
});

// Mocking

test("Test 8", () => {
  const array = [1, 2, 3];
  const mockFunction = jest.fn(x => 2 * x);

  array.forEach(mockFunction);

  const calls = mockFunction.mock.calls;

  expect(calls).toHaveLength(3);

  const firstCall = calls[0];
  const firstParam = firstCall[0];

  expect(firstParam).toBe(1);

  const results = mockFunction.mock.results;

  expect(results[1].value).toBe(4);

  expect(mockFunction).toHaveReturned();

  const mockFunctionReturnValue = jest.fn();

  mockFunctionReturnValue.mockReturnValue("some value");

  const returnValue = mockFunctionReturnValue();

  expect(returnValue).toBe("some value");
});

// Note. Call module mocking at file scope
//jest.mock("axios");

test.skip("Test 9", () => {
  const resp = "some data";

  // Mocking a module
  // All three mocking strategies would work. Which is best? Depends on the circumstance

  // 1
  //axios.get.mockResolvedValue(resp);

  // 2
  //axios.get.mockImplementation(() => Promise.resolve(resp));
  //axios.get.mockImplementationOnce(() => Promise.resolve(resp));

  // 3
  axios.get.mockImplementationOnce(() => Promise.resolve(resp));

  return axios
    .get("test url")
    .then(resp => {
      expect(resp).toBe("some data");
    })
    .catch(() => {
      throw "Could not connect";
    });
});

// Spy on
test("Test 10", () => {
  // To capture the function calls and their params (assert that certain side effects happend without actually replacing them)
  const getMock = jest.spyOn(axios, "get");

  axios.get("test url");

  expect(getMock).toHaveBeenCalled();
});

test("Test 11", () => {
  // To mock the actual function implementation, and then restore it.
  const getMock = jest.spyOn(axios, "get");

  getMock.mockImplementation(() => 10);

  expect(getMock()).toBe(10);

  expect(getMock).toHaveBeenCalled();

  getMock.mockRestore();

  console.log(axios.get(""));
});
