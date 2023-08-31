import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextareaField } from "../components/TextareaField";
import { DataTestId, TestingContent } from "../enums";

describe("SubmitDefaultDisabled.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
        console.warn = jest.fn();
    });

    test("TextareaField", async () => {
        render(<TextareaField />);

        expect(screen.getByTestId(DataTestId.Textarea)).toHaveAttribute("placeholder", TestingContent.InputText);

        // default valid text should be shown
        expect(screen.queryByTestId(DataTestId.Error)).toBeNull();
        expect(screen.queryByTestId(DataTestId.InvalidText)).toBeNull();
        expect(screen.getByTestId(DataTestId.ValidText)).toBeTruthy();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit event
        expect(console.warn).not.toBeCalled();

        // error text should be shown
        expect(screen.getByTestId(DataTestId.Error)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.InvalidText)).toBeNull();
        expect(screen.queryByTestId(DataTestId.ValidText)).toBeNull();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // default valid text should be shown
        expect(screen.queryByTestId(DataTestId.Error)).toBeNull();
        expect(screen.queryByTestId(DataTestId.InvalidText)).toBeNull();
        expect(screen.getByTestId(DataTestId.ValidText)).toBeTruthy();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: "James Bon" }
        });

        // default valid text should be shown
        expect(screen.queryByTestId(DataTestId.Error)).toBeNull();
        expect(screen.queryByTestId(DataTestId.InvalidText)).toBeNull();
        expect(screen.getByTestId(DataTestId.ValidText)).toBeTruthy();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: TestingContent.JamesBond }
        });

        // default valid text should be shown
        expect(screen.queryByTestId(DataTestId.Error)).toBeNull();
        expect(screen.queryByTestId(DataTestId.InvalidText)).toBeNull();
        expect(screen.getByTestId(DataTestId.ValidText)).toBeTruthy();

        // input too much text
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: "James BondJ" }
        });

        // invalid text should be shown
        expect(screen.queryByTestId(DataTestId.Error)).toBeNull();
        expect(screen.getByTestId(DataTestId.InvalidText)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.ValidText)).toBeNull();

        // input too much text
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: "James Bond Junior" }
        });

        // invalid text should be shown
        expect(screen.queryByTestId(DataTestId.Error)).toBeNull();
        expect(screen.getByTestId(DataTestId.InvalidText)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.ValidText)).toBeNull();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit event
        expect(console.warn).not.toBeCalled();

        // invalid text should be shown
        expect(screen.queryByTestId(DataTestId.Error)).toBeNull();
        expect(screen.getByTestId(DataTestId.InvalidText)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.ValidText)).toBeNull();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: TestingContent.JamesBond }
        });

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            description: TestingContent.JamesBond
        });
    });
});
