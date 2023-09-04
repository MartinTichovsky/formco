import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { wait } from "../utils/utils";
import { InvalidFormUseCase1 } from "./InvalidFormUseCase1";

console.warn = jest.fn(() => {
    return "";
});

const resetTestId = "reset";

test("InvalidFormUseCase1", async () => {
    expect(console.warn).not.toBeCalled();

    render(<InvalidFormUseCase1 />);

    await wait(100);

    expect(console.warn).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId(resetTestId));

    await wait(100);

    expect(console.warn).toBeCalledTimes(2);
});
