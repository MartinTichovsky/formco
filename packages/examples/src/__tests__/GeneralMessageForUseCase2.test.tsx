import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import {
    GeneralMessageForUseCase2,
    givenNameValidText,
    surnameValidText
} from "../components/GeneralMessageForUseCase2";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralMessageForUseCase2.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<GeneralMessageForUseCase2 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // text should be not in the document
        expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });
        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // text should be not in the document
        expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

        // click the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            givenName: TestingContent.James,
            surname: TestingContent.Bond
        });

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: "James Junior" }
        });

        expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

        // input an invalid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });

        expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();
    });
});
