import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldComponent } from "../components/TextFieldComponent";
import { testInvalidMessage } from "./utils/selectors";

console.log = jest.fn();

const classInputId = "class-input";
const functionalInputId = "functional-input";
const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

test("TextFieldComponent", async () => {
  const { container } = render(<TextFieldComponent />);

  // the inputs with this id must be in the document
  expect(container.querySelector(`#${classInputId}`)).toBeTruthy();
  expect(container.querySelector(`#${functionalInputId}`)).toBeTruthy();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // two errors must be shown
  testInvalidMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // one error must be shown
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
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));
});
