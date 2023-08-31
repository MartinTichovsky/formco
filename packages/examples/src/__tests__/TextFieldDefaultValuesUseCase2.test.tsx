import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextFieldDefaultValuesUseCase2 } from "../components/TextFieldDefaultValuesUseCase2";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("TextFieldDefaultValuesUseCase2.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<TextFieldDefaultValuesUseCase2 />);

        // the first input must have default value
        expect(screen.getByTestId(DataTestId.FirstName)).toHaveValue(TestingContent.James);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveValue("");

        // first input should be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // no input should be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.JamesJunior }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.JamesJunior,
            surname: TestingContent.Bond
        });

        // input an empty value should show an error and reset the first input
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: "" }
        });

        // the first input must have default value
        expect(screen.getByTestId(DataTestId.FirstName)).toHaveValue(TestingContent.James);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveValue("");

        // one error should be shown
        testInvalidMessage(container, 1);

        // first input should be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // no errors should be shown
        testInvalidMessage(container, 0);

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: "" }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // no errors should be shown
        testInvalidMessage(container, 0);

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.JamesJunior }
        });

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // no input should be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();

        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the first input must have default value
        expect(screen.getByTestId(DataTestId.FirstName)).toHaveValue(TestingContent.James);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveValue("");

        // first input should be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });
    });
});
