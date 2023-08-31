import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextFieldHiddenUseCase2 } from "../components/TextFieldHiddenUseCase2";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("TextFieldHiddenUseCase2.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<TextFieldHiddenUseCase2 />);

        // the first and the third input must not be in the document
        expect(screen.queryByTestId(DataTestId.Salutation)).toBeNull();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Surname)).toBeNull();
        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({});

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: " " }
        });

        // the first and the third input must not be in the document
        expect(screen.queryByTestId(DataTestId.Salutation)).toBeNull();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Surname)).toBeNull();
        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // the first input must not be in the document and the submit button must be disabled
        expect(screen.queryByTestId(DataTestId.Salutation)).toBeNull();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Surname)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // the first input must not be in the document and the submit button must be disabled
        expect(screen.queryByTestId(DataTestId.Salutation)).toBeNull();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Surname)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // all fields must be in the document
        expect(screen.getByTestId(DataTestId.Salutation)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Surname)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Salutation), {
            target: { value: " " }
        });

        // all fields must be in the document
        expect(screen.getByTestId(DataTestId.Salutation)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Surname)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            salutation: " ",
            surname: TestingContent.Bond
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.Salutation), {
            target: { value: "Mr." }
        });

        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(4);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            salutation: "Mr.",
            surname: TestingContent.Bond
        });

        fireEvent.click(screen.getByTestId(DataTestId.Reset));
    });
});
