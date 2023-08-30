import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CN } from "formco";
import * as React from "react";
import {
    GeneralRequiredCommonMessage,
    invalidFieldClassName,
    invalidGlobalClassName,
    validFieldClassName,
    validGlobalClassName,
    validValidationClassName
} from "../components/GeneralRequiredCommonMessage";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralRequiredCommonMessage.tsx", () => {
    const checkStarCount = (container: HTMLElement) => {
        expect(container.querySelectorAll(`.${CN.RequiredStar}`).length).toBe(5);
    };

    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<GeneralRequiredCommonMessage />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        checkStarCount(container);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input should have global message
        expect(screen.getByTestId(DataTestId.InputFieldRow1).querySelector(`.${invalidGlobalClassName}`)).toBeTruthy();

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // input should have global message
        expect(screen.getByTestId(DataTestId.InputFieldRow1).querySelector(`.${validGlobalClassName}`)).toBeTruthy();

        // input valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input should have global message
        expect(screen.getByTestId(DataTestId.InputFieldRow2).querySelector(`.${invalidGlobalClassName}`)).toBeTruthy();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select a radio option
        fireEvent.click(screen.getByTestId(DataTestId.Radio2));

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input should have validation message
        expect(
            screen.getByTestId(DataTestId.RadioFieldRow1).querySelector(`.${validValidationClassName}`)
        ).toBeTruthy();

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.CaptionOption1 }
        });

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input should have field message
        expect(screen.getByTestId(DataTestId.SelectFieldRow).querySelector(`.${validGlobalClassName}`)).toBeTruthy();

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: "" }
        });

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input should have global message
        expect(screen.getByTestId(DataTestId.SelectFieldRow).querySelector(`.${invalidGlobalClassName}`)).toBeTruthy();

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.ValueOption3 }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // select a option
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: " " }
        });

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input should have global message
        expect(screen.getByTestId(DataTestId.TextareaFieldRow).querySelector(`.${invalidFieldClassName}`)).toBeTruthy();

        // select a option
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: TestingContent.Description }
        });

        // submit should not be disabled
        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // input should have global message
        expect(screen.getByTestId(DataTestId.TextareaFieldRow).querySelector(`.${validFieldClassName}`)).toBeTruthy();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            description: TestingContent.Description,
            givenName: TestingContent.James,
            surname: TestingContent.Bond,
            radio: TestingContent.CaptionOption2,
            select: TestingContent.ValueOption3
        });

        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit should be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        checkStarCount(container);
    });
});
