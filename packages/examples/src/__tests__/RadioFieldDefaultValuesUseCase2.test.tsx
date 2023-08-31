import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioFieldDefaultValuesUseCase2 } from "../components/RadioFieldDefaultValuesUseCase2";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioFieldDefaultValuesUseCase1.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioFieldDefaultValuesUseCase2 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the option 1 and 2 of radio volume 1 and 3 should be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio31)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // check pre-selected options
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // click on the first option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // one error should be shown
        testInvalidMessage(container, 1);

        // the option 1 and 2 of radio volume 1 and option 2 of radio volume 3 should be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // click on the first option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio31));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the second option of radio volume 1 and 3 should be hidden
        expect(screen.getByTestId(DataTestId.Radio11)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption11,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption31
        });

        // click on the second option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // one error should be shown
        testInvalidMessage(container, 1);

        // the option 1 and 2 of radio volume 1 and option 1 of radio volume 3 should be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio31)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // check pre-selected options
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // click on the third option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio13));

        // errors should not be shown
        testInvalidMessage(container, 0);

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

        // click on the second option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio32));

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio13)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeChecked();

        // the first option of radio volume 1 and 3 should be hidden
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

        // click on the second option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio12));

        // click on the first option of radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // one error should be shown
        testInvalidMessage(container, 1);

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio21)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(3);

        // click on the third option of radio volume 1
        fireEvent.click(screen.getByTestId(DataTestId.Radio13));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the first and the second option of radio volume 1 and the second option of radio volume 3 should be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // check selected options
        expect(screen.getByTestId(DataTestId.Radio13)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(4);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption13,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption33
        });

        // click on the first option of radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio31));

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the option 1 and 2 of radio volume 1 and 3 should be hidden
        expect(screen.queryByTestId(DataTestId.Radio11)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio12)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio13)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.queryByTestId(DataTestId.Radio31)).toBeNull();
        expect(screen.queryByTestId(DataTestId.Radio32)).toBeNull();
        expect(screen.getByTestId(DataTestId.Radio33)).toBeTruthy();

        // check pre-selected options
        expect(screen.getByTestId(DataTestId.Radio33)).toBeChecked();
    });
});
