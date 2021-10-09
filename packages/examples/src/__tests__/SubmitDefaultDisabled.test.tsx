import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { SubmitDefaultDisabled } from "../SubmitDefaultDisabled";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitBottomTestId = "submit-bottom";
const submitTopTestId = "submit-top";
const surnameTestId = "surname";

test("SubmitDefaultDisabled", async () => {
  const { container, unmount } = render(<SubmitDefaultDisabled />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // the buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: " " }
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  // the buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "J" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // input an empty value
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "" }
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // the buttons must be disabled
  expect(screen.getByTestId(submitBottomTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).toBeDisabled();

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must not be disabled
  expect(screen.getByTestId(submitBottomTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTopTestId)).not.toBeDisabled();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTopTestId));
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitBottomTestId));
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  fireEvent.click(screen.getByTestId(resetTestId));

  unmount();
});
