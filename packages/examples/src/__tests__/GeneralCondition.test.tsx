import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  formIsValidText,
  GeneralCondition,
  submitConditionText
} from "../GeneralCondition";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();
console.error = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

test("GeneralCondition", async () => {
  const { container, unmount } = render(<GeneralCondition />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the condition text must not be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // the custom condition text must be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  // two errors should be shown
  testInvalidMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // the custom condition text must be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // both condition text must be in the document
  expect(screen.queryByText(formIsValidText)).toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).toBeInTheDocument();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the condition text must not be in the document
  expect(screen.queryByText(formIsValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(submitConditionText)).not.toBeInTheDocument();

  unmount();
});
