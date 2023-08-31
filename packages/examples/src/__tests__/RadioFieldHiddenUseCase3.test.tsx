import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioFieldHiddenUseCase3 } from "../components/RadioFieldHiddenUseCase3";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioFieldHiddenUseCase3.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioFieldHiddenUseCase3 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the first and the second option of radio volume 1 and 3 must be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio31)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

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

        // the first option of radio volume 2 should not be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // select the second option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // the second option of radio volume 2 should not be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio31)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

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

        // the second option of radio volume 1 and 3 should not be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio31)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

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

        // the first and the second option of radio volume 1 must be hidden, the second option of radio volume 3 must be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // no options should be checked except for the first option of radio volume 2
        expect(screen.getByTestId(DataTestId.Radio13)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).not.toBeChecked();

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // two errros should be shown
        testInvalidMessage(container, 2);

        expect(console.log).toBeCalledTimes(4);

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

        // the first and the second option of radio volume 1 and 3 must be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio31)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();
    });
});
