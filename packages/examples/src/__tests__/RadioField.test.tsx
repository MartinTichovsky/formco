import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioField } from "../components/RadioField";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioField.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioField />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the first option
        fireEvent.click(screen.getByTestId(DataTestId.Radio1));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({ radio: TestingContent.CaptionOption1 });

        // click on the second option
        fireEvent.click(screen.getByTestId(DataTestId.Radio2));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({ radio: TestingContent.CaptionOption2 });

        // click on the third option
        fireEvent.click(screen.getByTestId(DataTestId.Radio3));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({ radio: TestingContent.CaptionOption3 });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // no option must be selected
        expect(screen.getByTestId(DataTestId.Radio1)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio2)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio3)).not.toBeChecked();
    });
});
