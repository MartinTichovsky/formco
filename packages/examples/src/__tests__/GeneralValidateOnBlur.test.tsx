import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { GeneralValidateOnBlur } from "../components/GeneralValidateOnBlur";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralValidateOnBlur.tsx", () => {
    const testSuite = async (container: HTMLElement) => {
        // errors should not be shown
        testInvalidMessage(container, 0);

        // blur on the input
        fireEvent.blur(screen.getByTestId(DataTestId.GivenName));

        // one error should be shown
        testInvalidMessage(container, 1);

        // blur on the input
        fireEvent.blur(screen.getByTestId(DataTestId.Surname));

        // two errors should be shown
        testInvalidMessage(container, 2);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // input an empty value
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input an empty value
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // input valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // blur on the input
        fireEvent.blur(screen.getByTestId(DataTestId.GivenName));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // blur on the input
        fireEvent.blur(screen.getByTestId(DataTestId.Surname));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            givenName: TestingContent.James,
            surname: TestingContent.Bond
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));
    };

    beforeAll(() => {
        console.log = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("Field", async () => {
        const { container } = render(<GeneralValidateOnBlur inputValidateOnBlur={true} validateOnBlur={false} />);

        await testSuite(container);
    });

    test("FormController", async () => {
        const { container } = render(<GeneralValidateOnBlur />);

        await testSuite(container);
    });
});
