import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { RadioFieldDisabledUseCase1 } from "../components/RadioFieldDisabledUseCase1";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("RadioFieldDisabledUseCase1.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<RadioFieldDisabledUseCase1 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

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

        // click on the first option of the radio volume 2
        fireEvent.click(screen.getByTestId(DataTestId.Radio21));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the radio volume 1 must be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
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

        // all inputs must not be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).not.toBeDisabled();
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
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            radioVolume1: TestingContent.CaptionOption12,
            radioVolume2: TestingContent.CaptionOption21,
            radioVolume3: TestingContent.CaptionOption32
        });

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the radio volume 1 and 3 must be disabled
        expect(screen.getByTestId(DataTestId.Radio11)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio12)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio21)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio22)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio31)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio32)).toBeDisabled();
    });
});
