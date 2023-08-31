import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextFieldValidationDependencies } from "../components/TextFieldValidationDependencies";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("TextFieldValidationDependencies.tsx", () => {
    const testSuite = async (container: HTMLElement, submitForValidation: boolean = true) => {
        // errors should not be shown
        testInvalidMessage(container, 0);

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error2)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();

        if (submitForValidation) {
            // submit invalid form
            await waitFor(async () => {
                fireEvent.click(screen.getByTestId(DataTestId.Submit));
            });

            // check the onSubmit action
            expect(console.warn).not.toBeCalled();

            // three errors should be shown
            testInvalidMessage(container, 3);

            // all errors should be shown
            expect(screen.getByTestId(DataTestId.Error1)).toBeTruthy();
            expect(screen.getByTestId(DataTestId.Error2)).toBeTruthy();
            expect(screen.getByTestId(DataTestId.Error3)).toBeTruthy();
        }

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // three errors should be shown
        testInvalidMessage(container, 3);

        // all errors should be shown
        expect(screen.getByTestId(DataTestId.Error1)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Error2)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Error3)).toBeTruthy();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.warn).not.toBeCalled();

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // first error should be shown
        expect(screen.getByTestId(DataTestId.Error1)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Error2)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.warn).not.toBeCalled();

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.Middlename), {
            target: { value: TestingContent.Ronald }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error2)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            middleName: TestingContent.Ronald,
            surname: TestingContent.Bond
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error2)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();

        if (submitForValidation) {
            // submit invalid form
            await waitFor(async () => {
                fireEvent.click(screen.getByTestId(DataTestId.Submit));
            });

            // three errors should be shown
            testInvalidMessage(container, 3);

            // all errors should be shown
            expect(screen.getByTestId(DataTestId.Error1)).toBeTruthy();
            expect(screen.getByTestId(DataTestId.Error2)).toBeTruthy();
            expect(screen.getByTestId(DataTestId.Error3)).toBeTruthy();
        }

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // two errors should  be shown
        expect(screen.getByTestId(DataTestId.Error1)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Error2)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.Middlename), {
            target: { value: TestingContent.Ronald }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // one error should  be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.getByTestId(DataTestId.Error2)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error2)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        if (submitForValidation) {
            // submit invalid form
            await waitFor(async () => {
                fireEvent.click(screen.getByTestId(DataTestId.Submit));
            });
        }

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.Middlename), {
            target: { value: TestingContent.Ronald }
        });

        // two errors should  be shown
        testInvalidMessage(container, 2);

        // two errors should  be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.getByTestId(DataTestId.Error2)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Error3)).toBeTruthy();

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // two errors should  be shown
        testInvalidMessage(container, 2);

        // two errors should  be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.getByTestId(DataTestId.Error2)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Error3)).toBeTruthy();

        // input a text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.Error1)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error2)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Error3)).toBeNull();
    };

    beforeAll(() => {
        console.log = jest.fn();
        console.warn = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("Validation on submit", async () => {
        const { container } = render(<TextFieldValidationDependencies />);
        await testSuite(container);
    });

    test("Validation on change", async () => {
        const { container } = render(<TextFieldValidationDependencies validateOnChange />);

        await testSuite(container, false);
    });
});
