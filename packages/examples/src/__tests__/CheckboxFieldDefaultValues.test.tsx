import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { CheckboxFieldDefaultValues } from "../components/CheckboxFieldDefaultValues";
import { DataTestId } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("CheckboxFieldDefaultValues.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<CheckboxFieldDefaultValues />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({ checkbox2: true });

        // uncheck the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // check the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // click on the third checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox3));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            checkbox2: true,
            checkbox3: true
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();
    });
});
