import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { formIsValidText, GeneralCondition, submitConditionText } from "../components/GeneralCondition";
import { DataTestId, TestingContent } from "../enums";
import { testInvalidMessage } from "./utils/selectors";

describe("GeneralCondition.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<GeneralCondition />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // the condition text must not be in the document
        expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // the custom condition text must be in the document
        expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

        // two errors should be shown
        testInvalidMessage(container, 2);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // the custom condition text must be in the document
        expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

        // one error should be shown
        testInvalidMessage(container, 1);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // both condition text must be in the document
        expect(screen.queryByText(formIsValidText)).toBeInTheDocument();
        expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

        // errors should not be shown
        testInvalidMessage(container, 0);

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

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the condition text must not be in the document
        expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
        expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();
    });
});
