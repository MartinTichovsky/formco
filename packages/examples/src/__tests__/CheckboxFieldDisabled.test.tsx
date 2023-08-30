import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { CheckboxFieldDisabled } from "../components/CheckboxFieldDisabled";
import { DataTestId } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("CheckboxFieldDisabled.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<CheckboxFieldDisabled />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // the second checkbox should be disabled
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeDisabled();

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({ checkbox2: true });

        // check the first checkbox to enable the second one
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // no checkbox should be disabled
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox2)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeDisabled();

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            checkbox1: true,
            checkbox2: true
        });

        // uncheck the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // one error should be shown
        testInvalidMessage(container, 1);

        // uncheck the first checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // the second checkbox should be disabled
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeDisabled();

        // check the third checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox3));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({
            checkbox1: false,
            checkbox2: true,
            checkbox3: true
        });

        // check the first checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // uncheck the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // the second checkbox should be disabled
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeDisabled();
    });
});
