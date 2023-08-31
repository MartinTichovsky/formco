import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextFieldDisabledUseCase1 } from "../components/TextFieldDisabledUseCase1";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("TextFieldDisabledUseCase1.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<TextFieldDisabledUseCase1 />);

        // the first, the third input and the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: " " }
        });

        // the first, the third input and the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // the first input and the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // the first input and the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // only the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Salutation), {
            target: { value: " " }
        });

        // only the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input an empty value should disable all other inputs
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: "" }
        });

        // the first, the third input and the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // fill all inputs
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });
        fireEvent.change(screen.getByTestId(DataTestId.Salutation), {
            target: { value: "Mr." }
        });

        // the submit button must not be disabled
        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            salutation: "Mr.",
            surname: TestingContent.Bond
        });

        fireEvent.click(screen.getByTestId(DataTestId.Reset));
    });
});
