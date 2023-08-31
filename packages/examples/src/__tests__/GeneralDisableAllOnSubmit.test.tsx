import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { GeneralDisableAllOnSubmit } from "../components/GeneralDisableAllOnSubmit";
import { DataTestId } from "../enums";

describe("GeneralDisableAllOnSubmit.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        render(<GeneralDisableAllOnSubmit />);

        // all fields must not be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio1)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio2)).not.toBeDisabled();

        // submit the form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({});

        // all inputs must be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio1)).toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio2)).toBeDisabled();

        // reset the form
        fireEvent.click(screen.getByTestId(DataTestId.Reset));

        // all inputs most not be disabled
        expect(screen.getByTestId(DataTestId.FirstName)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Surname)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio1)).not.toBeDisabled();
        expect(screen.getByTestId(DataTestId.Radio2)).not.toBeDisabled();
    });
});
