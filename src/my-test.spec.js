test("string concatenation", () => {
  const a = "tree";
  const b = "house";

  const c = a.concat(b);

  expect(c).toBe("treehouse");
});

test("toHaveProperty matcher", () => {
  const car = {
    model: "Accord",
    manufacturer: {
      name: "Honda",
      origin: "Japan"
    },
    title: "Clean"
  };

  expect(car).toHaveProperty("title");
  expect(car).toHaveProperty("manufacturer.origin", "Japan");
});

test("toMatchObject matcher", () => {
  const car = {
    model: "Accord",
    manufacturer: {
      name: "Honda",
      origin: "Japan"
    },
    title: "Clean"
  };

  expect(car).toMatchObject({
    model: "Accord",
    manufacturer: { name: "Honda" }
  });
});

// Testing equality

test("primitive equality with toBe", () => {
  const a = 10;
  const b = 5 + 5;

  expect(a).toBe(b);

  const c = "foo bar";
  const d = "foo" + " " + "bar";

  expect(c).toBe(d);

  const e = 0;
  const f = "";

  expect(e).not.toBe(f);
});

test("object and array equality with toEqual", () => {
  const a = { name: "Bernie" };
  const b = {};
  b.name = "Bernie";

  expect(a).toEqual(b);

  expect(a).not.toBe(b); // Comparing they're references, which are not equal.
});

// Testing types

// Asynchronous tests:

// 3 common patterns

// Callbacks
// If using callbacks to handle asyncronous behavior. setTimeout, onChange, etc..

test("callbacks", done => {
  function callback(data) {
    try {
      expect(1).toBeTruthy();
      done();
    } catch (error) {
      done(error);
    }
  }

  setTimeout(callback, 5000);
});

// if done is never called, the test will fail.
// The jest description will be a generic timeout error. If you want more descriptive error messageing, you should call done with the error

// Promises.
// In order to assert on promises, the test function should return that promise
// Jest will resolve any asertions in your then or catch callback.
// If the promise fails, the test will automatically fail

const myPromise = () => {
  return new Promise((resolve, reject) => {
    resolve("success");
  });
};

const myBadPromise = () => {
  return new Promise((resolve, reject) => {
    reject("error");
  });
};

test("promises", () => {
  return myPromise().then(result => {
    expect(result).toBe("success");
  });
});

// Tests with Async/Await
// Just as you would expect!

test("await functions", async () => {
  const data = await myPromise();
  expect(data).toBe("success");
});

test("failing await functions", async () => {
  try {
    const data = await myBadPromise();
  } catch (e) {
    expect(e).toBe("error");
  }
});

// Organizing

describe("Baseball test suite", () => {
  it("bat", () => {
    console.log("Testing bat");
    expect("bat").toEqual(expect.anything());
  });

  it("ball", () => {
    console.log("Testing ball");
    expect("ball").toEqual(expect.anything());
  });
});

// Mocking

test("Math.round", () => {
  // Define params
  const a = 1.1;

  // Call function with params
  const b = Math.round(a);

  // Assert on the result;
  expect(b).toBe(1);
});

test("forEach", () => {
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

  // Mock return value
  const anotherMock = jest.fn();
  anotherMock.mockReturnValue("some value");
  const returnValue = anotherMock();

  expect(returnValue).toBe("some value");
});

// jest.mock("./read-file");
// import readFile from "./read-file";

let readFile = filePath => {
  return "dynamic file contents";
};

let concatFiles = (fileA, fileB) => {
  const fileAContent = readFile(fileA);
  const fileBContent = readFile(fileB);

  return fileAContent + "\n" + fileBContent;
};

test("mocking readFile to test concatFiles", () => {
  readFile = jest.fn();
  readFile.mockReturnValue("foo");

  const candidateProfile = concatFiles("File A", "File B");

  expect(candidateProfile).toBe("foo" + "\n" + "foo");
});

// Note. Call module mocking at file scope

import axios from "axios";
jest.mock("axios");

test("mocking axios", () => {
  const expectedResponse = "some data";

  // Mocking functions exposed by axios
  // Two approaches:

  // 1. mock return value
  axios.get.mockResolvedValue(expectedResponse);

  // 2. mock the entire implementation
  //axios.get.mockImplementation(() => Promise.resolve(expectedResponse));

  return axios.get("test url").then(response => {
    expect(response).toBe(expectedResponse);
  });
});

// Spy on
test("spy on axios calls", () => {
  // To capture the function calls and their params (assert that certain side effects happend without actually replacing them)
  const getMock = jest.spyOn(axios, "get");

  axios.get("test url");

  expect(getMock).toHaveBeenCalled();
});

test("spy on axios calls and mocking it's implementation", () => {
  // To mock the actual function implementation, and then restore it.
  const getMock = jest.spyOn(axios, "get");
  const response = "Some data";

  getMock.mockImplementation(() => response);
  expect(getMock()).toBe(response);

  expect(getMock).toHaveBeenCalled();

  getMock.mockRestore();
});
