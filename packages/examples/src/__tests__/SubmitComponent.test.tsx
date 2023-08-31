import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { SubmitComponent } from "../components/SubmitComponent";
import { DataTestId, TestingContent } from "../enums";
import { wait } from "../utils/utils";
import { testInvalidMessage } from "./utils/selectors";

describe("SubmitComponent.tsx", () => {
    beforeAll(() => {
        console.error = jest.fn();
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<SubmitComponent />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the buttons must not have the pending text
        expect(screen.getByTestId(DataTestId.ClassSubmit)).not.toHaveTextContent(TestingContent.Pending);
        expect(screen.getByTestId(DataTestId.FunctionalSubmit)).not.toHaveTextContent(TestingContent.Pending);

        // click on the class submit component
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.ClassSubmit));
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // click on the functional submit component
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.FunctionalSubmit));
        });

        // two errors must be shown
        testInvalidMessage(container, 2);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // input valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // click on the class submit component
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.ClassSubmit));
        });

        expect(screen.getByTestId(DataTestId.ClassSubmit)).toHaveTextContent(TestingContent.Pending);

        expect(screen.getByTestId(DataTestId.FunctionalSubmit)).not.toHaveTextContent(TestingContent.Pending);

        // check the onSubmit action
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });

        // click on the functional submit component
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.FunctionalSubmit));
        });

        // the functional component button must have the pending text
        expect(screen.getByTestId(DataTestId.ClassSubmit)).toHaveTextContent(TestingContent.Pending);

        expect(screen.getByTestId(DataTestId.FunctionalSubmit)).toHaveTextContent(TestingContent.Pending);

        // check the onSubmit action
        expect(console.log).toHaveBeenCalledTimes(2);
        expect(console.log).toHaveBeenCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });

        // wait for delay
        await act(async () => {
            await wait(2000);
        });

        // after timout the submit buttons must not have the pending text
        expect(screen.getByTestId(DataTestId.ClassSubmit)).not.toHaveTextContent(TestingContent.Pending);
        expect(screen.getByTestId(DataTestId.FunctionalSubmit)).not.toHaveTextContent(TestingContent.Pending);

        await waitFor(async () => {
            // click on the buttons to cause pending again
            fireEvent.click(screen.getByTestId(DataTestId.FunctionalSubmit));
            fireEvent.click(screen.getByTestId(DataTestId.ClassSubmit));
        });

        // reset the form to unmount the elements and create new ones
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // wait for delay
        await act(async () => {
            await wait(2000);
        });

        // no console errors should be caused
        expect(console.error).not.toBeCalled();

        // the submit buttons must not have the pending text
        expect(screen.getByTestId(DataTestId.ClassSubmit)).not.toHaveTextContent(TestingContent.Pending);
        expect(screen.getByTestId(DataTestId.FunctionalSubmit)).not.toHaveTextContent(TestingContent.Pending);
    });
});
