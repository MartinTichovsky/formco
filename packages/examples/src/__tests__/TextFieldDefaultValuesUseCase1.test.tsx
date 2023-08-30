import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextFieldDefaultValuesUseCase1 } from "../components/TextFieldDefaultValuesUseCase1";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("TextFieldDefaultValuesUseCase1.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<TextFieldDefaultValuesUseCase1 />);

        // the inputs must have default values
        expect(screen.getByTestId(DataTestId.GivenName)).toHaveValue(TestingContent.James);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveValue(TestingContent.Bond);

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

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: "" }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // input an empty value should show an error
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: "" }
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        expect(console.log).toBeCalledTimes(1);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the inputs must have default values
        expect(screen.getByTestId(DataTestId.GivenName)).toHaveValue(TestingContent.James);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveValue(TestingContent.Bond);
    });
});
