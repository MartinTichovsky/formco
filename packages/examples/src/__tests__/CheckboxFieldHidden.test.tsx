import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { CheckboxFieldHidden } from "../components/CheckboxFieldHidden";
import { DataTestId } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("CheckboxFieldHidden.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<CheckboxFieldHidden />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(() => screen.getByTestId(DataTestId.Checkbox2)).toThrowError();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({});

        // check the first checkbox to enable the second one
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

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
        expect(() => screen.getByTestId(DataTestId.Checkbox2)).toThrowError();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // check the first checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox2)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // check the third checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox3));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({
            checkbox1: true,
            checkbox2: true,
            checkbox3: true
        });

        // uncheck the first checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(4);
        expect(console.log).lastCalledWith({
            checkbox1: false,
            checkbox3: true
        });

        // check the first checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the second checkbox should be checked
        expect(screen.getByTestId(DataTestId.Checkbox1)).not.toBeChecked();
        expect(() => screen.getByTestId(DataTestId.Checkbox2)).toThrowError();
        expect(screen.getByTestId(DataTestId.Checkbox3)).not.toBeChecked();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // check the first checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // uncheck the second checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox2));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // uncheck the first checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(5);
        expect(console.log).lastCalledWith({ checkbox1: false });
    });
});
