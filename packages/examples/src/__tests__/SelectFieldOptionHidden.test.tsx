import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SelectFieldOptionHidden } from "../components/SelectFieldOptionHidden";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("SelectFieldOptionHidden.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<SelectFieldOptionHidden />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // options should be hidden
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option").length).toBe(1);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error must be shown
        testInvalidMessage(container, 1);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.CaptionOption22 }
        });

        // one error must be shown
        testInvalidMessage(container, 1);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).not.toHaveBeenCalled();

        // second option should not be hidden
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option").length).toBe(2);
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toHaveTextContent(
            TestingContent.CaptionOption12
        );

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: TestingContent.CaptionOption12 }
        });

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            select1: TestingContent.CaptionOption12,
            select2: TestingContent.CaptionOption22
        });

        // select an empty option
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: "" }
        });

        // one error must be shown
        testInvalidMessage(container, 1);

        // select previous option
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: TestingContent.CaptionOption12 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.ValueOption23 }
        });

        // third option should not be hidden
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option").length).toBe(2);
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toHaveTextContent(
            TestingContent.CaptionOption13
        );

        // one error must be shown
        testInvalidMessage(container, 1);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: TestingContent.ValueOption13 }
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

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: "" }
        });

        // one error must be shown
        testInvalidMessage(container, 1);

        // options should be hidden
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option").length).toBe(1);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.CaptionOption21 }
        });

        // first option should not be hidden
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option").length).toBe(2);
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toHaveTextContent(
            TestingContent.CaptionOption11
        );

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // options should be hidden
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option").length).toBe(1);

        // errors should not be shown
        testInvalidMessage(container, 0);
    });
});
