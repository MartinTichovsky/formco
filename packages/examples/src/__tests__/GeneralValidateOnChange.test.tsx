import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { GeneralValidateOnChange } from "../components/GeneralValidateOnChange";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralValidateOnChange.tsx", () => {
    const testSuite = async (container: HTMLElement) => {
        // errors should not be shown
        testInvalidMessage(container, 0);

        // blur on the input
        fireEvent.blur(screen.getByTestId(DataTestId.FirstName));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: " " }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // blur on the input
        fireEvent.blur(screen.getByTestId(DataTestId.Surname));

        // one error should be shown
        testInvalidMessage(container, 1);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // input valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({ firstName: TestingContent.James, surname: TestingContent.Bond });

        fireEvent.click(screen.getByTestId(DataTestId.Reset));
    };

    beforeAll(() => {
        console.log = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("Field", async () => {
        const { container } = render(<GeneralValidateOnChange inputValidateOnChange={true} validateOnChange={false} />);

        await testSuite(container);
    });

    test("FormController", async () => {
        const { container } = render(<GeneralValidateOnChange />);

        await testSuite(container);
    });
});
