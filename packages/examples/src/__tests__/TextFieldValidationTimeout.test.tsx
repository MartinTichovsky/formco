import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { TextFieldValidationTimeout } from "../components/TextFieldValidationTimeout";
import { wait } from "../utils/utils";
import { testInvalidMessage } from "./utils/selectors";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

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

  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });
});
