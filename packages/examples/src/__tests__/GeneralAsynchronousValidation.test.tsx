import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { GeneralAsynchronousValidation, TIMEOUT } from "../components/GeneralAsynchronousValidation";
import { DataTestId, TestingContent } from "../enums";
import { wait } from "../utils/utils";
import { testInvalidMessage, testValidMessage } from "./utils/selectors";

describe("GeneralAsynchronousValidation.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("Submit without touch the inputs", async () => {
        const { container } = render(<GeneralAsynchronousValidation />);

        // errors should not be shown
        testInvalidMessage(container, 0);

        // submit invalid form
        fireEvent.click(screen.getByTestId(DataTestId.Submit));

        // errors should not be shown
        testInvalidMessage(container, 0);

        // two pending texts should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(2);

        // wait for the validation result
        await act(async () => {
            await wait(2000);
        });

        // two errors should be shown
        testInvalidMessage(container, 2);

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // errors should not be shown
        testInvalidMessage(container, 0);
    });

    test("Input values", async () => {
        const { container } = render(<GeneralAsynchronousValidation />);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // a pending text should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(1);

        // wait for the validation result
        await act(async () => {
            await wait(2000);
        });

        // one valid message should be shown
        testValidMessage(container, 1);

        // no error should be shown
        testInvalidMessage(container, 0);

        // no pending text should be shown
        expect(screen.queryAllByText(TestingContent.Pending).length).toBe(0);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // a pending text should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(1);

        // wait for the validation result
        await act(async () => {
            await wait(2000);
        });

        // two valid messages should be shown
        testValidMessage(container, 2);

        // no error should be shown
        testInvalidMessage(container, 0);

        // submit valid form
        fireEvent.click(screen.getByTestId(DataTestId.Submit));

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });
    });

    test("Click on the submit during validation pending", async () => {
        render(<GeneralAsynchronousValidation />);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // a pending text should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(1);

        await act(async () => {
            await wait(500);
        });

        // submit invalid form
        fireEvent.click(screen.getByTestId(DataTestId.Submit));

        expect(screen.getByTestId(DataTestId.Submit)).toBeDisabled();

        // two pending texts should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(2);

        await act(async () => {
            await wait(TIMEOUT);
        });

        // check the onSubmit action
        expect(console.log).not.toBeCalled();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: TestingContent.James }
        });

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // submit invalid form
        fireEvent.click(screen.getByTestId(DataTestId.Submit));

        // check the onSubmit action
        expect(console.log).not.toBeCalled();

        await act(async () => {
            await wait(TIMEOUT + TIMEOUT / 2);
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({
            firstName: TestingContent.James,
            surname: TestingContent.Bond
        });
    });

    test("Multiple inputs", async () => {
        const { container } = render(<GeneralAsynchronousValidation />);

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: "J" }
        });

        await act(async () => {
            await wait(1000);
        });

        // a pending text should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(1);

        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: "Ja" }
        });

        await act(async () => {
            await wait(1000);
        });

        // a pending text should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(1);

        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: "Jam" }
        });

        await act(async () => {
            await wait(1000);
        });

        // a pending text should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(1);

        fireEvent.change(screen.getByTestId(DataTestId.FirstName), {
            target: { value: "" }
        });

        await act(async () => {
            await wait(1000);
        });

        // a pending text should be shown
        expect(screen.getAllByText(TestingContent.Pending).length).toBe(1);

        await act(async () => {
            await wait(1000);
        });

        // one error message should be shown
        testInvalidMessage(container, 1);
    });
});
