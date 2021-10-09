import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GeneralValidateOnChange } from "../GeneralValidateOnChange";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

test("GeneralValidateOnChange", async () => {
  const { container, unmount } = render(<GeneralValidateOnChange />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: " " }
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  // input valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // input a valid text
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
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  fireEvent.click(screen.getByTestId(resetTestId));

  unmount();
});
