import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { GeneralScrollToError } from "../components/GeneralScrollToError";
import { DataTestId, TestingContent } from "../enums";

describe("GeneralScrollToError.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        Element.prototype.scrollTo = jest.fn();
        render(<GeneralScrollToError />);

        expect(Element.prototype.scrollTo).not.toBeCalled();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // giveName should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(1);
        expect(screen.getByTestId(DataTestId.GivenName)).toHaveFocus();

        // input a given name
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // surname should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(2);
        expect(screen.getByTestId(DataTestId.Surname)).toHaveFocus();

        // input a surname
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: "Bond A" }
        });

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // note should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(3);
        expect(screen.getByTestId(DataTestId.Note)).toHaveFocus();

        // input a note
        fireEvent.change(screen.getByTestId(DataTestId.Note), {
            target: { value: "Note" }
        });

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // select should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(4);
        expect(screen.getByTestId(DataTestId.Select)).toHaveFocus();

        // select an option
        fireEvent.change(screen.getByTestId(DataTestId.Select), {
            target: { value: TestingContent.CaptionOption1 }
        });

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // the first radio should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(5);
        expect(screen.getByTestId(DataTestId.Radio1)).toHaveFocus();

        // select an option
        fireEvent.click(screen.getByTestId(DataTestId.Radio1));

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // checkbox should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(6);
        expect(screen.getByTestId(DataTestId.Checkbox1)).toHaveFocus();

        // check the checkbox
        fireEvent.click(screen.getByTestId(DataTestId.Checkbox1));

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // nothing should change
        expect(Element.prototype.scrollTo).toBeCalledTimes(6);

        // change the surname to hide the first option of radio
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // the second radio should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(7);
        expect(screen.getByTestId(DataTestId.Radio2)).toHaveFocus();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // givenName should have focus
        expect(Element.prototype.scrollTo).toBeCalledTimes(8);
        expect(screen.getByTestId(DataTestId.GivenName)).toHaveFocus();
    });
});
