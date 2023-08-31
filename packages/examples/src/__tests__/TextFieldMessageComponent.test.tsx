import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { TextFieldMessageComponent } from "../components/TextFieldMessageComponent";
import { DataTestId, TestingContent } from "../enums";

describe("TextFieldMessageComponent.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        render(<TextFieldMessageComponent />);

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.ClassComponent)).toBeNull();
        expect(screen.queryByTestId(DataTestId.FunctionalComponent)).toBeNull();

        // submit invalid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // errors must be shown
        expect(screen.getByTestId(DataTestId.ClassComponent)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.FunctionalComponent)).toBeTruthy();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.ClassComponent)).toBeNull();
        expect(screen.queryByTestId(DataTestId.FunctionalComponent)).toBeNull();

        // input an empty text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        // functional error must be shown
        expect(screen.queryByTestId(DataTestId.ClassComponent)).toBeNull();
        expect(screen.getByTestId(DataTestId.FunctionalComponent)).toBeTruthy();

        // input an empty text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // two errors must be shown
        expect(screen.getByTestId(DataTestId.ClassComponent)).toBeTruthy();
        expect(screen.getByTestId(DataTestId.FunctionalComponent)).toBeTruthy();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // errors should not be shown
        expect(screen.queryByTestId(DataTestId.ClassComponent)).toBeNull();
        expect(screen.queryByTestId(DataTestId.FunctionalComponent)).toBeNull();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            givenName: TestingContent.James,
            surname: TestingContent.Bond
        });
    });
});
