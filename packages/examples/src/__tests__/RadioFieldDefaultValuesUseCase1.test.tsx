import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioFieldDefaultValuesUseCase1 } from "../components/RadioFieldDefaultValuesUseCase1";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioFieldDefaultValuesUseCase1.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioFieldDefaultValuesUseCase1 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the option 1 and 2 of radio volume 1 and 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio23)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check pre-selected options
        expect(screen.getByTestId(DataTestId.Radio11)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the first option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // the option 1 and 2 of radio volume 1 and option 2 of radio volume 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio23)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption11,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption33
        });

        // click on the third option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio13));

        // the option 1 and 2 of radio volume 1 and option 2 of radio volume 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio23)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio13)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption33
        });

        // click on the option 3 of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio31));

        // the second option of radio volume 1 and 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio23)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption31
        });

        // errors should not be shown
        testInvalidMessage(container, 0);

        // click on the second option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // the first and second option of radio volume 1 and the first option of radio volume 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio23)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio13)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeChecked();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the second option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio32));

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(4);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption32
        });

        // the first option of radio volume 1 and 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio13)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeChecked();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(5);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption32
        });

        // click on the second option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio12));

        // the first option of radio volume 1 and 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio12)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeChecked();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(6);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption12,
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption32
        });

        // click on the first option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // the option 1 and 2 of radio volume 1 and the second option of radio volume 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio21)).toBeChecked();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 2);

        // click on the first option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio11));

        // click on the first option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio31));

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(7);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption11,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption31
        });

        // click on the third option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio13));

        // click on the first option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio23));

        // the second option of radio volume 1 and 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio13)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio23)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(8);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption23,
            radioVolume3: TestingContent.CaptionOption33
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the option 1 and 2 of radio volume 1 and 3 should be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeDisabled();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio11)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);
    });
});
