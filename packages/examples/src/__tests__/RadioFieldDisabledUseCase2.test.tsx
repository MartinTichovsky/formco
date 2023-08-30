import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioFieldDisabledUseCase2 } from "../components/RadioFieldDisabledUseCase2";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioFieldDisabledUseCase2.tsx", () => {
    let expectedConsoleLogCallNumber = 0;

    const testWorkflow = async (container: HTMLElement) => {
        // the radio volume 1 and 3 must be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the second option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second option of the radio volume 3 should not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeDisabled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the second option of the radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio32));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second option of the radio volume 1 should not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeDisabled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the second option of the radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio12));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(expectedConsoleLogCallNumber++ + 1);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption12,
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption32
        });

        // click on the first option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // no inputs must be checked
        expect(screen.getByTestId(DataTestId.Radio11)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeChecked();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the first option of the radio volume 3 should not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the first option of the radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio31));

        // the first option of the radio volume 1 should not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();

        // click on the first option of the radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio11));

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(expectedConsoleLogCallNumber++ + 1);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption11,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption31
        });

        // click on the second option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // errors should not be shown
        testInvalidMessage(container, 0);
    };

    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioFieldDisabledUseCase2 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // first test
        await testWorkflow(container);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // second test
        await testWorkflow(container);
    });
});
