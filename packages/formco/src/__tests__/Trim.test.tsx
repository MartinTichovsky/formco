import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { Trim } from "./Trim";

console.warn = jest.fn();

const givenNameTestId = "givenName";
const surnameTestId = "surname";
const submitTestId = "submit";

test("The values should be the same as entered", async () => {
    const onSubmit = jest.fn();
    render(<Trim onSubmit={(fields) => onSubmit(fields)} />);

    fireEvent.change(screen.getByTestId(givenNameTestId), {
        target: { value: " James " }
    });

    fireEvent.change(screen.getByTestId(surnameTestId), {
        target: { value: " Bond " }
    });

    // submit the form
    await waitFor(async () => {
        fireEvent.click(screen.getByTestId(submitTestId));
    });

    // the values must be the same as entered
    expect(onSubmit).lastCalledWith({ givenName: " James ", surname: " Bond " });
});

test("The values should be trimmed", async () => {
    const onSubmit = jest.fn();
    render(<Trim onSubmit={(fields) => onSubmit(fields)} options={{ trimValues: true }} />);

    fireEvent.change(screen.getByTestId(givenNameTestId), {
        target: { value: " James " }
    });

    fireEvent.change(screen.getByTestId(surnameTestId), {
        target: { value: " Bond " }
    });

    // submit the form
    await waitFor(async () => {
        fireEvent.click(screen.getByTestId(submitTestId));
    });

    // the values must be trimmed
    expect(onSubmit).lastCalledWith({ givenName: "James", surname: "Bond" });
});
