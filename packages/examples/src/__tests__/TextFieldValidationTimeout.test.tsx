import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";
import { TextFieldValidationTimeout } from "../components/TextFieldValidationTimeout";
import { DataTestId, TestingContent } from "../enums";
import { wait } from "../utils/utils";
import { testInvalidMessage } from "./utils/selectors";

describe("TextFieldValidationTimeout.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<TextFieldValidationTimeout />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: " " }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        await act(async () => {
            await wait(1000);
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        await act(async () => {
            await wait(1000);
        });

        // one error should be shown
        await waitFor(() => testInvalidMessage(container, 1));

        // submit the form
        fireEvent.click(screen.getByTestId(DataTestId.Submit));

        // second error should be shown immediately
        await waitFor(() => testInvalidMessage(container, 2));

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // input an empty value
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: " " }
        });

        // errors should not be shown
        await waitFor(() => testInvalidMessage(container, 0));

        // blur on the input
        fireEvent.blur(screen.getByTestId(DataTestId.FirstName));

        // one error should not be shown immediately when onBlur event
        await waitFor(() => testInvalidMessage(container, 1));

        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });
    });
});
