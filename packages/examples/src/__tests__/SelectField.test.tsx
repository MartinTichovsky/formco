import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SelectField } from "../components/SelectField";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("SelectField.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<SelectField />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error must be shown
        testInvalidMessage(container, 1);

        // select an option without a value property
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.CaptionOption1 }
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
            select: TestingContent.CaptionOption1
        });

        // select an option with a value property
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.ValueOption3 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            select: TestingContent.ValueOption3
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.CaptionOption2 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an empty option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: "" }
        });

        // one error should be shown
        testInvalidMessage(container, 1);
    });
});
