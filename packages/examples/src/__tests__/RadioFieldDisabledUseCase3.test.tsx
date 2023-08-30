import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioFieldDisabledUseCase3 } from "../components/RadioFieldDisabledUseCase3";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioFieldDisabledUseCase3.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioFieldDisabledUseCase3 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the first and the second option of radio volume 1 and 3 must be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // three errors should be shown
        testInvalidMessage(container, 3);

        // select all needed options
        fireEvent.click(screen.getByTestId(DataTestId.Radio13));
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));
        fireEvent.click(screen.getByTestId(DataTestId.Radio33));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption33
        });

        // the first option of radio volume 2 should not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // select the second option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // the second option of radio volume 2 should not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // the third option of radio volume 1 and 3 should be still selected
        expect(screen.getByTestId(DataTestId.Radio13)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption33
        });

        // select the first option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio32));

        // the second option of radio volume 1 and 3 should not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption32
        });

        // select the second option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio12));

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(4);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption12,
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption32
        });

        // select the first option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // the first and the second option of radio volume 1 must be disabled, the second option of radio volume 3 must be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // no options should be checked except for the first option of radio volume 2
        expect(screen.getByTestId(DataTestId.Radio11)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeChecked();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // two errros should be shown
        testInvalidMessage(container, 2);

        // select the first option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio31));

        // one errro should be shown
        testInvalidMessage(container, 1);

        // select the first option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio11));

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(5);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption11,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption31
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the first and the second option of radio volume 1 and 3 must be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();
    });
});
