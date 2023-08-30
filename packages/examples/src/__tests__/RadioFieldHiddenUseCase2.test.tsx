import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioFieldHiddenUseCase2 } from "../components/RadioFieldHiddenUseCase2";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioFieldHiddenUseCase2.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioFieldHiddenUseCase2 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the radio volume 1 and 3 must be hidden
        expect(() => screen.getByTestId(DataTestId.Radio11)).toThrowError();
        expect(() => screen.getByTestId(DataTestId.Radio12)).toThrowError();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(() => screen.getByTestId(DataTestId.Radio31)).toThrowError();
        expect(() => screen.getByTestId(DataTestId.Radio32)).toThrowError();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the first option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the radio volume 3 must be hidden
        expect(screen.getByTestId(DataTestId.Radio11)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(() => screen.getByTestId(DataTestId.Radio31)).toThrowError();
        expect(() => screen.getByTestId(DataTestId.Radio32)).toThrowError();

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
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption12,
            radioVolume2: TestingContent.CaptionOption21
        });

        // click on the second option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // the radio volume 1 must be hidden
        expect(() => screen.getByTestId(DataTestId.Radio11)).toThrowError();
        expect(() => screen.getByTestId(DataTestId.Radio12)).toThrowError();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeTruthy();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // one error should be shown
        testInvalidMessage(container, 1);

        // click on the first option of the radio volume 3
        fireEvent.click(screen.getByTestId(DataTestId.Radio31));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({
            radioVolume2: TestingContent.CaptionOption22,
            radioVolume3: TestingContent.CaptionOption31
        });

        // click on the first option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // the radio volume 1 must have no selected options
        expect(screen.getByTestId(DataTestId.Radio11)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeChecked();

        // click on the second option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio22));

        // the radio volume 3 must have no selected options
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeChecked();
        expect(screen.getByTestId(DataTestId.Radio32)).not.toBeChecked();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the radio volume 1 and 3 must be hidden
        expect(() => screen.getByTestId(DataTestId.Radio11)).toThrowError();
        expect(() => screen.getByTestId(DataTestId.Radio12)).toThrowError();
        expect(screen.getByTestId(DataTestId.Radio21)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.Radio22)).toBeTruthy();
        expect(() => screen.getByTestId(DataTestId.Radio31)).toThrowError();
        expect(() => screen.getByTestId(DataTestId.Radio32)).toThrowError();
    });
});
