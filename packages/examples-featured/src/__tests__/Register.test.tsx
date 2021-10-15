import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { Register } from "../Register/Register";
import { testInvalidMessage } from "../utils/selectors";
import { wait } from "../utils/utils";

const usernameInvalidTestId = "username-invalid";
const usernameTestId = "username";
const usernameLoadingTestId = "username-loading";
const usernameValidTestId = "username-valid";

const fetch: jest.Mock = (global.fetch = jest.fn());

const mockResponse = (response: any, waitTimeout?: number) => {
  fetch.mockImplementation(async (url: RequestInfo, init?: RequestInit) => {
    if (waitTimeout) {
      await wait(waitTimeout);
    }

    return {
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      body: {} as ReadableStream,
      bodyUsed: false,
      clone: () => ({} as Response),
      formData: () => Promise.resolve(new FormData()),
      headers: (init?.headers || {}) as Headers,
      json: () => Promise.resolve(response),
      ok: true,
      redirected: false,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve(JSON.stringify(response)),
      type: "basic",
      url: url.toString()
    };
  });
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Register", () => {
  test("Call count on blur", async () => {
    render(<Register />);

    // mock the response
    mockResponse({ isValid: true }, 2000);

    // input a value
    fireEvent.change(screen.getByTestId(usernameTestId), {
      target: { value: "James" }
    });

    // wait for the fetch to be called
    await wait(500);

    // the fetch should be called once
    expect(fetch).toBeCalledTimes(1);

    // blur action on the input
    fireEvent.blur(screen.getByTestId(usernameTestId));

    await wait(500);

    // the fetch should be still called once
    expect(fetch).toBeCalledTimes(1);
  });

  test("Fetch", async () => {
    const { container } = render(<Register />);

    // loading should not be in the document
    expect(() => screen.getByTestId(usernameLoadingTestId)).toThrowError();

    // input one letter to trigger a promise with wait
    fireEvent.change(screen.getByTestId(usernameTestId), {
      target: { value: "J" }
    });

    await wait(500);

    // no error should be shown
    testInvalidMessage(container, 0);

    // wait for the return of the fetch
    await act(async () => {
      await wait(1000);
    });

    // one error message should be shown
    testInvalidMessage(container, 1);

    // mock the fetch response
    mockResponse({ isValid: true }, 1000);

    // inout valid text to trigger a fetch
    fireEvent.change(screen.getByTestId(usernameTestId), {
      target: { value: "James" }
    });

    // loading should be shown
    expect(screen.getByTestId(usernameLoadingTestId)).toBeTruthy();

    // wait for the response
    await act(async () => {
      await wait(1500);
    });

    // loading should not be shown
    expect(() => screen.getByTestId(usernameLoadingTestId)).toThrowError();

    // an icon with a checkmark should be shown
    expect(screen.getByTestId(usernameValidTestId)).toBeTruthy();

    // mock the fetch response to show an invalid message
    mockResponse({ isValid: false }, 1000);

    // input a text
    fireEvent.change(screen.getByTestId(usernameTestId), {
      target: { value: "James B" }
    });

    // loading should be shown
    expect(screen.getByTestId(usernameLoadingTestId)).toBeTruthy();

    // wait for the response
    await act(async () => {
      await wait(1500);
    });

    // loading should not be shown
    expect(() => screen.getByTestId(usernameLoadingTestId)).toThrowError();

    // an invalid message should be shown
    expect(screen.getByTestId(usernameInvalidTestId)).toBeTruthy();
  }, 6000);
});
