import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SubmitDefaultDisabled } from "../components/SubmitDefaultDisabled";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("SubmitDefaultDisabled.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<SubmitDefaultDisabled />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the buttons must be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).toBeDisabled();

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // the buttons must be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).toBeDisabled();

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // the buttons must be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).toBeDisabled();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: "J" }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // input an empty value
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: "" }
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // the buttons must be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).toBeDisabled();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the buttons must not be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).not.toBeDisabled();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.SubmitTop));
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({ givenName: TestingContent.James, surname: TestingContent.Bond });

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.SubmitBottom));
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({ givenName: TestingContent.James, surname: TestingContent.Bond });

        fireEvent.click(screen.getByTestId(DataTestId.Reset));
    });
});
