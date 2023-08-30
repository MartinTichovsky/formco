import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SelectFieldOptionDisabled } from "../components/SelectFieldOptionDisabled";
import { DataTestId, TestingContent } from "../enums";
import { wait } from "../utils/utils";
import { testInvalidMessage } from "./utils/selectors";

describe("SelectFieldOptionDisabled.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<SelectFieldOptionDisabled />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // options should be disabled
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[2]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[3]).toBeDisabled();

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

        // second option should not be disabled
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[2]).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[3]).toBeDisabled();

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

        // third option should not be disabled
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[2]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[3]).not.toBeDisabled();

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

        await wait(1000);

        // one error must be shown
        testInvalidMessage(container, 1);

        // options should be disabled
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[2]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[3]).toBeDisabled();

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.CaptionOption21 }
        });

        // first option should not be disabled
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[2]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[3]).toBeDisabled();

        // one error must be shown
        testInvalidMessage(container, 1);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // options should be disabled
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[1]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[2]).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Select1).querySelectorAll("option")[3]).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select2), {
            target: { value: TestingContent.CaptionOption21 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select1), {
            target: { value: TestingContent.CaptionOption11 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);
    });
});
