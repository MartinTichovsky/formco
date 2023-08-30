import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextField } from "../components/TextField";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

const fieldComponentName = "FormFieldComponent";
const formControllerComponentName = "FormControllerComponent";
const submitComponentName = "SubmitComponent";

describe("TextField.c.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    beforeEach(() => {
        collector.reset();
    });

    test("Basic", async () => {
        const { container } = render(<TextField />);

        expect(screen.getByTestId(DataTestId.GivenName)).toHaveAttribute("placeholder", TestingContent.InputGivenName);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveAttribute("placeholder", TestingContent.InputSurname);

        // render count check
        expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.GivenName })).toBe(1);
        expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(1);
        expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // error messages should be visible after click
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.GivenName })).toBe(2);
        expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(2);
        expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);

        // repeat submit should no more render the inputs
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.GivenName })).toBe(2);
        expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(2);
        expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);

        // input a text to the first input, after change or submit should be visible only one error message
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // input a text to the second input, after change should be visible no errors
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({ givenName: TestingContent.James, surname: TestingContent.Bond });
    });

    describe("Re-render", () => {
        test("Without Values", () => {
            render(<TextField />);

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(2); // beacause the form controller creates a controller `useEffect` and set it with `setController`
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(1);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(1);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);

            fireEvent.click(screen.getByTestId(DataTestId.ReRender));

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(2);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(1);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(1);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(2);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(1);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(1);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);
        });

        test("With Errors", async () => {
            const { container } = render(<TextField />);

            await waitFor(async () => {
                fireEvent.click(screen.getByTestId(DataTestId.Submit));
            });

            fireEvent.click(screen.getByTestId(DataTestId.ReRender));

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(2);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(2); // because the second render is the submit event (validation)
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(2);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);

            // two errors should be shown
            testInvalidMessage(container, 2);

            fireEvent.click(screen.getByTestId(DataTestId.ReRender));
        });

        test("With Values", () => {
            render(<TextField />);

            fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
                target: { value: TestingContent.James }
            });
            fireEvent.change(screen.getByTestId(DataTestId.Surname), {
                target: { value: TestingContent.Bond }
            });

            fireEvent.click(screen.getByTestId(DataTestId.ReRender));

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(2);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(1);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(1);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(1);

            expect(screen.getByTestId(DataTestId.GivenName)).toHaveValue(TestingContent.James);
            expect(screen.getByTestId(DataTestId.Surname)).toHaveValue(TestingContent.Bond);
        });
    });

    describe("Reset", () => {
        test("Without Values", () => {
            render(<TextField />);

            fireEvent.click(screen.getByTestId(DataTestId.Reset));

            expect(screen.getByTestId(DataTestId.GivenName)).toHaveAttribute(
                "placeholder",
                TestingContent.InputGivenName
            );
            expect(screen.getByTestId(DataTestId.Surname)).toHaveAttribute("placeholder", TestingContent.InputSurname);

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(3);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(2);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(2);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(2);

            fireEvent.click(screen.getByTestId(DataTestId.Reset));

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(4);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(3);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(3);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(3);
        });

        test("With Errors", async () => {
            const { container } = render(<TextField />);

            await waitFor(async () => {
                fireEvent.click(screen.getByTestId(DataTestId.Submit));
            });

            fireEvent.click(screen.getByTestId(DataTestId.Reset));

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(3);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(3);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(3);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(2);

            // no errors must be shown
            testInvalidMessage(container, 0);
        });

        test("With values", () => {
            render(<TextField />);

            fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
                target: { value: TestingContent.James }
            });
            fireEvent.change(screen.getByTestId(DataTestId.Surname), {
                target: { value: TestingContent.Bond }
            });

            const reset = screen.getByTestId(DataTestId.Reset);
            fireEvent.click(reset);

            // render count check
            expect(
                collector.getCallCount(formControllerComponentName, {
                    dataTestId: DataTestId.FormController
                })
            ).toBe(3);
            expect(
                collector.getCallCount(fieldComponentName, {
                    dataTestId: DataTestId.GivenName
                })
            ).toBe(2);
            expect(collector.getCallCount(fieldComponentName, { dataTestId: DataTestId.Surname })).toBe(2);
            expect(collector.getCallCount(submitComponentName, { dataTestId: DataTestId.Submit })).toBe(2);

            expect(screen.getByTestId(DataTestId.GivenName)).toHaveValue("");
            expect(screen.getByTestId(DataTestId.Surname)).toHaveValue("");
        });
    });
});
