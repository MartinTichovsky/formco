import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import {
    GeneralMessageForUseCase1,
    givenNameErrorText,
    surnameErrorText
} from "../components/GeneralMessageForUseCase1";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralMessageForUseCase1.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<GeneralMessageForUseCase1 />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // text should be not in the document
        expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });
        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        // text should be not in the document
        expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // click the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        expect(screen.queryByText(givenNameErrorText)).toBeInTheDocument();
        expect(screen.queryByText(surnameErrorText)).toBeInTheDocument();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameErrorText)).toBeInTheDocument();

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();

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

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: " " }
        });
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: " " }
        });

        expect(screen.queryByText(givenNameErrorText)).toBeInTheDocument();
        expect(screen.queryByText(surnameErrorText)).toBeInTheDocument();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        expect(screen.queryByText(givenNameErrorText)).not.toBeInTheDocument();
        expect(screen.queryByText(surnameErrorText)).not.toBeInTheDocument();
    });
});
