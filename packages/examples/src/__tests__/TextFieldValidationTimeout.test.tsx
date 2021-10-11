import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { TextFieldValidationTimeout } from "../TextFieldValidationTimeout";
import { testInvalidMessage } from "../utils/selectors";
import { wait } from "../utils/utils";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";

test("TextFieldValidationTimeout", async () => {
  const { container } = render(<TextFieldValidationTimeout />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input an empty value
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  await wait(1000);

  // errors should not be shown
  testInvalidMessage(container, 0);

  await act(async () => {
    await wait(1000);
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // submit the form
  fireEvent.click(screen.getByTestId(submitTestId));

  // second error should be shown immediately
  testInvalidMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // input an empty value
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // blur on the input
  fireEvent.blur(screen.getByTestId(givenNameTestId));

  // one error should not be shown immediately when onBlur event
  testInvalidMessage(container, 1);
});
