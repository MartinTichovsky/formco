import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { GeneralLabel } from "../components/GeneralLabel";
import { DataTestId, TestingContent } from "../enums";

describe("GeneralLabel.tsx", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });

    test("Basic", async () => {
        const { container } = render(<GeneralLabel />);

        // three labels must exist
        const labels = container.querySelectorAll("label");
        expect(labels.length).toBe(3);

        // click on the first label
        userEvent.click(screen.getByText(TestingContent.Salutation));
        expect(screen.getByTestId(DataTestId.Salutation)).toHaveFocus();

        // click on the second label
        userEvent.click(screen.getByText(TestingContent.FirstName));
        expect(screen.getByTestId(DataTestId.FirstName)).toHaveFocus();

        // click on the third label
        userEvent.click(screen.getByText(TestingContent.Surname));
        expect(screen.getByTestId(DataTestId.Surname)).toHaveFocus();

        // submit valid form
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId(DataTestId.Submit));
        });

        // check the onSubmit action
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).lastCalledWith({});

        fireEvent.click(screen.getByTestId(DataTestId.Reset));
    });
});
