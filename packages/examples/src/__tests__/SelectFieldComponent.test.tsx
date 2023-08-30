import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SelectFieldComponent } from "../components/SelectFieldComponent";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("SelectFieldComponent.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<SelectFieldComponent />);

        // the selects with this id must be in the document
        expect(container.querySelector(`#${DataTestId.ClassSelect}`)).toBeTruthy();
        expect(container.querySelector(`#${DataTestId.FuntionalSelect}`)).toBeTruthy();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // two errors must be shown
        testInvalidMessage(container, 2);

        // select an option without a value property
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: TestingContent.CaptionOption11 }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // select an option without a value property
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.CaptionOption21 }
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
            select1: TestingContent.CaptionOption11,
            select2: TestingContent.CaptionOption21
        });

        // select an option with a value property
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: TestingContent.ValueOption13 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an option with a value property
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.ValueOption23 }
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
            select1: TestingContent.ValueOption13,
            select2: TestingContent.ValueOption23
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: TestingContent.CaptionOption12 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.CaptionOption22 }
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
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: "" }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // select an empty option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: "" }
        });

        // two errors should be shown
        testInvalidMessage(container, 2);
    });
});
