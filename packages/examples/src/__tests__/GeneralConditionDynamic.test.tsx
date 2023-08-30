import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { GeneralConditionDynamic } from "../components/GeneralConditionDynamic";
import { DataTestId, TestingContent } from "../enums";

describe("GeneralConditionDynamic.tsx", () => {
    const getTestedGivenNameText = (name: string) => `Your given name is: ${name}`.trim();
    const getTesteSurnameText = (name: string) => `Your surname is: ${name}`.trim();

    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        render(<GeneralConditionDynamic />);

        // the default text should be visible
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(getTestedGivenNameText(""));
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(getTesteSurnameText(""));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({});

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: "J" }
        });

        // test expected text
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(getTestedGivenNameText("J"));
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(getTesteSurnameText(""));

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: "Ja" }
        });

        // test expected text
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(getTestedGivenNameText("Ja"));
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(getTesteSurnameText(""));

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.GivenName), {
            target: { value: TestingContent.James }
        });

        // test expected text
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(
            getTestedGivenNameText(TestingContent.James)
        );
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(getTesteSurnameText(""));

        // click on the submit button
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).lastCalledWith({ givenName: TestingContent.James });

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: "B" }
        });

        // test expected text
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(
            getTestedGivenNameText(TestingContent.James)
        );
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(getTesteSurnameText("B"));

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: "Bo" }
        });

        // test expected text
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(
            getTestedGivenNameText(TestingContent.James)
        );
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(getTesteSurnameText("Bo"));

        // input a valid text
        fireEvent.change(screen.getByTestId(DataTestId.Surname), {
            target: { value: TestingContent.Bond }
        });

        // test expected text
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(
            getTestedGivenNameText(TestingContent.James)
        );
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(
            getTesteSurnameText(TestingContent.Bond)
        );

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // the default text should be visible
        expect(screen.getByTestId(DataTestId.DynamicContent)).toHaveTextContent(getTestedGivenNameText(""));
        expect(screen.getByTestId(DataTestId.DynamicComponent)).toHaveTextContent(getTesteSurnameText(""));
    });
});
