import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SubmitCustom } from "../components/SubmitCustom";
import { DataTestId, TestingContent } from "../enums";
import { wait } from "../utils/utils";
import { testInvalidMessage } from "./utils/selectors";

describe("SubmitCustom.tsx", () => {
    beforeAll(() => {
        console.error = jest.fn();
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<SubmitCustom />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the submit button must not have the pending text
        expect(screen.getByTestId(DataTestId.Submit)).not.toHaveTextContent(TestingContent.Pending);

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // the submit button must have the pending text
        expect(screen.getByTestId(DataTestId.Submit)).toHaveTextContent(TestingContent.Pending);

        // check the onSubmit action
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });

        // wait for delay
        await act(async () => {
            await wait(2000);
        });

        // after timouet, the submit button must not have the pending text
        expect(screen.getByTestId(DataTestId.Submit)).not.toHaveTextContent(TestingContent.Pending);

        // submit the form to show the pending text again
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // reset the form to unmount the elements and create new ones
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // wait for delay
        await act(async () => {
            await wait(2000);
        });

        // no console errors should be caused
        expect(console.error).not.toBeCalled();

        // the submit button must not have the pending text
        expect(screen.getByTestId(DataTestId.Submit)).not.toHaveTextContent(TestingContent.Pending);
    });
});
