import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { CheckboxField } from "../components/CheckboxField";
import { DataTestId } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("CheckboxField.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<CheckboxField />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // check the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({ checkbox2: true });

        // check the third checkbox
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

        // uncheck the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox3));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({
            checkbox2: true,
            checkbox3: false
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // uncheck the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // one error should be shown
        testInvalidMessage(container, 1);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // no checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();
    });
});
