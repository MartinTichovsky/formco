import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldDefaultValuesUseCase1 } from "../TextFieldDefaultValuesUseCase1";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();
console.error = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

test("TextFieldDefaultValuesUseCase1", async () => {
  const { container, unmount } = render(<TextFieldDefaultValuesUseCase1 />);

  // the inputs must have default values
  expect(screen.getByTestId(givenNameTestId)).toHaveValue("James");
  expect(screen.getByTestId(surnameTestId)).toHaveValue("Bond");

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

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "" }
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(console.log).toBeCalledTimes(1);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the inputs must have default values
  expect(screen.getByTestId(givenNameTestId)).toHaveValue("James");
  expect(screen.getByTestId(surnameTestId)).toHaveValue("Bond");

  unmount();
});
