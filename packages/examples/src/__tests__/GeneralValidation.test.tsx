import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { GeneralValidationUseCase1 } from "../components/GeneralValidationUseCase1";
import { GeneralValidationUseCase2 } from "../components/GeneralValidationUseCase2";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralValidationUseCase", () => {
    const testWorkflow = async (container: HTMLElement) => {
        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        testInvalidMessage(container, 2);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
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
        expect(console.log).lastCalledWith({ givenName: TestingContent.James, surname: TestingContent.Bond });
    };

    beforeAll(() => {
        console.log = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("GeneralValidationUseCase1.tsx", async () => {
        const { container } = render(<GeneralValidationUseCase1 />);

        await testWorkflow(container);
    });

    test("GeneralValidationUseCase2.tsx", async () => {
        const { container } = render(<GeneralValidationUseCase2 />);

        await testWorkflow(container);
    });
});
