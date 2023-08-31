import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CN } from "formco";
import * as React from "react";
import { GeneralRequired } from "../components/GeneralRequired";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralRequired.tsx", () => {
    const allFieldsMustHaveInvalidClassName = () => {
        expect(screen.getByTestId(DataTestId.GivenName)).toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveClass(CN.InvalidField);
        expect(screen.queryByTestId(DataTestId.Radio1)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio2)).toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Radio3)).toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Select)).toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Textarea)).toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Checkbox1)).toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Checkbox2)).toHaveClass(CN.InvalidField);
    };

    const checkStarCount = (container: HTMLElement) => {
        expect(container.querySelectorAll(`.${CN.RequiredStar}`).length).toBe(7);
    };

    const expectNotTohaveClasses = (testId: string) => {
        expect(screen.getByTestId(testId)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(testId)).not.toHaveClass(CN.ValidField);
    };

    const expectToBeInvalid = (testId: string) => {
        expect(screen.getByTestId(testId)).toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(testId)).not.toHaveClass(CN.ValidField);
    };

    const expectToBeValid = (testId: string) => {
        expect(screen.getByTestId(testId)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(testId)).toHaveClass(CN.ValidField);
    };

    const noInvalidClassNamesAreProvided = () => {
        expect(screen.getByTestId(DataTestId.GivenName)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Surname)).not.toHaveClass(CN.InvalidField);
        expect(screen.queryByTestId(DataTestId.Radio1)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio2)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Radio3)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Select)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Textarea)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toHaveClass(CN.InvalidField);
        expect(screen.getByTestId(DataTestId.Checkbox2)).not.toHaveClass(CN.InvalidField);
    };

    const noValidClassNamesAreProvided = () => {
        expect(screen.getByTestId(DataTestId.GivenName)).not.toHaveClass(CN.ValidField);
        expect(screen.getByTestId(DataTestId.Surname)).not.toHaveClass(CN.ValidField);
        expect(screen.getByTestId(DataTestId.Radio2)).not.toHaveClass(CN.ValidField);
        expect(screen.getByTestId(DataTestId.Radio3)).not.toHaveClass(CN.ValidField);
        expect(screen.getByTestId(DataTestId.Select)).not.toHaveClass(CN.ValidField);
        expect(screen.getByTestId(DataTestId.Textarea)).not.toHaveClass(CN.ValidField);
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toHaveClass(CN.ValidField);
        expect(screen.getByTestId(DataTestId.Checkbox2)).not.toHaveClass(CN.ValidField);
    };

    const submitInvalidForm = async () => {
        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).not.toBeCalled();
    };

    beforeAll(() => {
        console.log = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("Validate on change", async () => {
        const { container } = render(<GeneralRequired />);

        // stars must be in the document
        checkStarCount(container);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check invalid class names
        noInvalidClassNamesAreProvided();

        // check valid class names
        noValidClassNamesAreProvided();

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // first radio option should have a star not the others
        expect(screen.getByTestId(DataTestId.RadioFieldRow1).querySelector(`.${CN.RequiredStar}`)).toBeNull();
        expect(screen.getByTestId(DataTestId.RadioFieldRow2).querySelector(`.${CN.RequiredStar}`)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.RadioFieldRow3).querySelector(`.${CN.RequiredStar}`)).toBeNull();

        // input an empty values
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: " " }
        });

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeInvalid(DataTestId.GivenName);
        expectToBeInvalid(DataTestId.Surname);
        expect(screen.queryByTestId(DataTestId.Radio1)).toBeNull();
        expectNotTohaveClasses(DataTestId.Radio2);
        expectNotTohaveClasses(DataTestId.Radio3);
        expectNotTohaveClasses(DataTestId.Select);
        expectToBeInvalid(DataTestId.Textarea);
        expectNotTohaveClasses(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: "Bon" }
        });

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // check fields
        expectToBeInvalid(DataTestId.GivenName);
        expectToBeInvalid(DataTestId.Surname);
        expect(screen.queryByTestId(DataTestId.Radio1)).toBeNull();
        expectNotTohaveClasses(DataTestId.Radio2);
        expectNotTohaveClasses(DataTestId.Radio3);
        expectNotTohaveClasses(DataTestId.Select);
        expectToBeInvalid(DataTestId.Textarea);
        expectNotTohaveClasses(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // input  values
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: TestingContent.Description }
        });

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectNotTohaveClasses(DataTestId.Radio1);
        expectNotTohaveClasses(DataTestId.Radio2);
        expectNotTohaveClasses(DataTestId.Radio3);
        expectNotTohaveClasses(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectNotTohaveClasses(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        fireEvent.click(screen.getByTestId(DataTestId.Radio1));

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectNotTohaveClasses(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectNotTohaveClasses(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.CaptionOption1 }
        });

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectNotTohaveClasses(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // select an empty option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: "" }
        });

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeInvalid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectNotTohaveClasses(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.ValueOption3 }
        });

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectNotTohaveClasses(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // check a checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectToBeValid(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // uncheck a checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // one error should be shown
        testInvalidMessage(container, 1);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectToBeInvalid(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // check a checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectToBeValid(DataTestId.Checkbox1);
        expectNotTohaveClasses(DataTestId.Checkbox2);

        // check a checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // submit button must be disabled
        expect(screen.getByTestId(DataTestId.Submit)).not.toBeDisabled();

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectToBeValid(DataTestId.Checkbox1);
        expectToBeValid(DataTestId.Checkbox2);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            checkbox1: true,
            checkbox2: true,
            description: TestingContent.Description,
            givenName: TestingContent.James,
            radio: TestingContent.CaptionOption1,
            select: TestingContent.ValueOption3,
            surname: TestingContent.Bond
        });

        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // stars must be in the document
        checkStarCount(container);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check invalid class names
        noInvalidClassNamesAreProvided();

        // check valid class names
        noValidClassNamesAreProvided();
    });

    test("Validate on submit", async () => {
        const { container } = render(
            <GeneralRequired disabledByDefault={false} disableIfNotValid={false} validateOnChange={false} />
        );

        // stars must be in the document
        checkStarCount(container);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check invalid class names
        noInvalidClassNamesAreProvided();

        // check valid class names
        noValidClassNamesAreProvided();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: " " }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check invalid class names
        noInvalidClassNamesAreProvided();

        // check valid class names
        noValidClassNamesAreProvided();

        // first radio option should have a star not the others
        expect(screen.getByTestId(DataTestId.RadioFieldRow1).querySelector(`.${CN.RequiredStar}`)).toBeNull();
        expect(screen.getByTestId(DataTestId.RadioFieldRow2).querySelector(`.${CN.RequiredStar}`)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.RadioFieldRow3).querySelector(`.${CN.RequiredStar}`)).toBeNull();

        await submitInvalidForm();

        // check invalid class names
        allFieldsMustHaveInvalidClassName();

        // check valid class names
        noValidClassNamesAreProvided();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // three errors should be shown
        testInvalidMessage(container, 3);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeInvalid(DataTestId.Surname);
        expectToBeInvalid(DataTestId.Radio1);
        expectToBeInvalid(DataTestId.Radio2);
        expectToBeInvalid(DataTestId.Radio3);
        expectToBeInvalid(DataTestId.Select);
        expectToBeInvalid(DataTestId.Textarea);
        expectToBeInvalid(DataTestId.Checkbox1);
        expectToBeInvalid(DataTestId.Checkbox2);

        // first radio option should have a star not the others
        expect(screen.getByTestId(DataTestId.RadioFieldRow1).querySelector(`.${CN.RequiredStar}`)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.RadioFieldRow2).querySelector(`.${CN.RequiredStar}`)).toBeNull();
        expect(screen.getByTestId(DataTestId.RadioFieldRow3).querySelector(`.${CN.RequiredStar}`)).toBeNull();

        await submitInvalidForm();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: "Bon" }
        });

        // four errors should be shown
        testInvalidMessage(container, 4);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeInvalid(DataTestId.Surname);
        expectToBeInvalid(DataTestId.Radio1);
        expectToBeInvalid(DataTestId.Radio2);
        expectToBeInvalid(DataTestId.Radio3);
        expectToBeInvalid(DataTestId.Select);
        expectToBeInvalid(DataTestId.Textarea);
        expectToBeInvalid(DataTestId.Checkbox1);
        expectToBeInvalid(DataTestId.Checkbox2);

        await submitInvalidForm();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // three errors should be shown
        testInvalidMessage(container, 3);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeInvalid(DataTestId.Radio1);
        expectToBeInvalid(DataTestId.Radio2);
        expectToBeInvalid(DataTestId.Radio3);
        expectToBeInvalid(DataTestId.Select);
        expectToBeInvalid(DataTestId.Textarea);
        expectToBeInvalid(DataTestId.Checkbox1);
        expectToBeInvalid(DataTestId.Checkbox2);

        // select a radio
        fireEvent.click(screen.getByTestId(DataTestId.Radio2));

        // two errors should be shown
        testInvalidMessage(container, 2);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeInvalid(DataTestId.Select);
        expectToBeInvalid(DataTestId.Textarea);
        expectToBeInvalid(DataTestId.Checkbox1);
        expectToBeInvalid(DataTestId.Checkbox2);

        await submitInvalidForm();

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.CaptionOption1 }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeInvalid(DataTestId.Textarea);
        expectToBeInvalid(DataTestId.Checkbox1);
        expectToBeInvalid(DataTestId.Checkbox2);

        await submitInvalidForm();

        // input a value
        fireEvent.change(screen.getByTestId(DataTestId.Textarea), {
            target: { value: TestingContent.Description }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectToBeInvalid(DataTestId.Checkbox1);
        expectToBeInvalid(DataTestId.Checkbox2);

        // check a checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectToBeValid(DataTestId.Checkbox1);
        expectToBeInvalid(DataTestId.Checkbox2);

        // check a checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // no errors should be shown
        testInvalidMessage(container, 0);

        // check fields
        expectToBeValid(DataTestId.GivenName);
        expectToBeValid(DataTestId.Surname);
        expectToBeValid(DataTestId.Radio1);
        expectToBeValid(DataTestId.Radio2);
        expectToBeValid(DataTestId.Radio3);
        expectToBeValid(DataTestId.Select);
        expectToBeValid(DataTestId.Textarea);
        expectToBeValid(DataTestId.Checkbox1);
        expectToBeValid(DataTestId.Checkbox2);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            checkbox1: true,
            checkbox2: true,
            description: TestingContent.Description,
            givenName: TestingContent.James,
            radio: TestingContent.CaptionOption2,
            select: TestingContent.CaptionOption1,
            surname: TestingContent.Bond
        });
    });
});
