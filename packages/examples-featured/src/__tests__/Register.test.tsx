import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { Register } from "../components/Register/Register";
import { RegisterDataTestId } from "../components/Register/Register.enums";
import { wait } from "../utils/utils";
import { testInvalidMessage, testValidMessage } from "./utils/selectors";

describe("Register", () => {
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
                clone: () => ({}) as Response,
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

    test("Fetch", async () => {
        const { container } = render(<Register />);

        // loading should not be in the document
        expect(screen.queryByTestId(RegisterDataTestId.UsernameLoading)).toBeNull();

        // input one letter to trigger a promise with wait
        fireEvent.change(screen.getByTestId(RegisterDataTestId.Username), {
            target: { value: "J" }
        });

        await wait(500);

        // no error should be shown
        testInvalidMessage(container, 0);

        // wait for the return of the fetch
        await act(async () => {
            await wait(2000);
        });

        // one error message should be shown
        testInvalidMessage(container, 1);

        // mock the fetch response
        mockResponse({ isValid: true }, 1000);

        // inout valid text to trigger a fetch
        fireEvent.change(screen.getByTestId(RegisterDataTestId.Username), {
            target: { value: "James" }
        });

        // loading should be shown
        expect(screen.getByTestId(RegisterDataTestId.UsernameLoading)).toBeTruthy();

        // wait for the response
        await act(async () => {
            await wait(1500);
        });

        // loading should not be shown
        expect(screen.queryByTestId(RegisterDataTestId.UsernameLoading)).toBeNull();

        // an icon with a checkmark should be shown
        expect(screen.getByTestId(RegisterDataTestId.UsernameValid)).toBeTruthy();

        // mock the fetch response to show an invalid message
        mockResponse({ isValid: false }, 1000);

        // input a text
        fireEvent.change(screen.getByTestId(RegisterDataTestId.Username), {
            target: { value: "James B" }
        });

        // loading should be shown
        expect(screen.getByTestId(RegisterDataTestId.UsernameLoading)).toBeTruthy();

        // wait for the response
        await act(async () => {
            await wait(1500);
        });

        // loading should not be shown
        expect(screen.queryByTestId(RegisterDataTestId.UsernameLoading)).toBeNull();

        // an invalid message should be shown
        expect(screen.getByTestId(RegisterDataTestId.UsernameInvalid)).toBeTruthy();
    });

    test("Call count on blur", async () => {
        render(<Register />);

        // mock the response
        mockResponse({ isValid: true }, 2000);

        // input a value
        fireEvent.change(screen.getByTestId(RegisterDataTestId.Username), {
            target: { value: "James" }
        });

        // wait for the fetch to be called
        await wait(500);

        // the fetch should be called once
        expect(fetch).toBeCalledTimes(1);

        // blur action on the input
        fireEvent.blur(screen.getByTestId(RegisterDataTestId.Username));

        await wait(500);

        // the fetch should be still called once
        expect(fetch).toBeCalledTimes(1);
    });

    test("Complete form", async () => {
        const { container } = render(<Register />);

        // mock the fetch response
        mockResponse({ isValid: true });

        // input a name
        fireEvent.change(screen.getByTestId(RegisterDataTestId.Username), {
            target: { value: "James" }
        });

        // input a name
        fireEvent.change(screen.getByTestId(RegisterDataTestId.Email), {
            target: { value: "james.bond@gmail.com" }
        });

        // submit button should be disabled
        expect(screen.getByTestId(RegisterDataTestId.Submit)).toBeDisabled();

        await act(async () => {
            await wait(500);
        });

        // no error should be shown
        testInvalidMessage(container, 0);

        // two valid messages should be visible
        testValidMessage(container, 2);

        // submit button should not be disabled
        expect(screen.getByTestId(RegisterDataTestId.Submit)).not.toBeDisabled();

        mockResponse({ ok: true }, 1000);

        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(RegisterDataTestId.Submit));
        });

        expect(screen.getByTestId(RegisterDataTestId.Pending)).toBeTruthy();

        await act(async () => {
            await wait(1500);
        });

        expect(screen.getByTestId(RegisterDataTestId.Message)).toBeTruthy();
    });
});
