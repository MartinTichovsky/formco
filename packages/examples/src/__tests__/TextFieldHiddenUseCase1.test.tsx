import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextFieldHiddenUseCase1 } from "../components/TextFieldHiddenUseCase1";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("TextFieldHiddenUseCase1.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<TextFieldHiddenUseCase1 />);

        // the first and the third input must not be in the document and the submit button must be disabled
        expect(screen.queryByTestId(DataTestId.Salutation)).toBeNull();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Surname)).toBeNull();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: " " }
        });

        // the first and the third input must not be in the document and the submit button must be disabled
        expect(screen.queryByTestId(DataTestId.Salutation)).toBeNull();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Surname)).toBeNull();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

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

        // the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Surname)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Salutation), {
            target: { value: " " }
        });

        // the submit button must be disabled
        expect(screen.getByTestId(DataTestId.Salutation)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Surname)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input an empty value should disable all other inputs
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: "" }
        });

        // the first and the third input must not be in the document and the submit button must be disabled
        expect(screen.queryByTestId(DataTestId.Salutation)).toBeNull();
        expect(screen.getByTestId(DataTestId.FirstName)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Surname)).toBeNull();
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
