import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SubmitDisabledOnSubmit } from "../components/SubmitDisabledOnSubmit";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("SubmitDefaultDisabled.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("SubmitDisabledOnSubmit", async () => {
        const { container } = render(<SubmitDisabledOnSubmit />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the buttons must not be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).not.toBeDisabled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.SubmitBottom));
        });

        // the buttons must be still disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).toBeDisabled();

        // two errors should be shown
        testInvalidMessage(container, 2);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the buttons must not be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).not.toBeDisabled();

        // input an empty value, the `validateOnChange` option is false, the empty value shouldn't cause an error
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: " " }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the buttons must not be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).not.toBeDisabled();

        // input an empty value, the `validateOnChange` option is false, the empty value shouldn't cause an error
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the buttons must not be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).not.toBeDisabled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.SubmitBottom));
        });

        // the buttons must be disabled
        expect(screen.getByTestId(DataTestId.SubmitBottom)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.SubmitTop)).toBeDisabled();

        // two errors should be shown
        testInvalidMessage(container, 2);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
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
        expect(console.log).lastCalledWith({ firstName: TestingContent.James, surname: TestingContent.Bond });

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.SubmitBottom));
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({ firstName: TestingContent.James, surname: TestingContent.Bond });
    });
});
