import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldMessageComponent } from "../TextFieldMessageComponent";

console.log = jest.fn();
console.error = jest.fn();

const classComponentTestId = "class-component";
const functionalComponentTestId = "functional-component";
const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

test("TextFieldMessageComponent", async () => {
  const { unmount } = render(<TextFieldMessageComponent />);

  // errors should not be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(() => screen.getByTestId(functionalComponentTestId)).toThrowError();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // errors must be shown
  expect(screen.getByTestId(classComponentTestId)).toBeTruthy();
  expect(screen.getByTestId(functionalComponentTestId)).toBeTruthy();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(() => screen.getByTestId(functionalComponentTestId)).toThrowError();

  // input an empty text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // functional error must be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(screen.getByTestId(functionalComponentTestId)).toBeTruthy();

  // input an empty text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: " " }
  });

  // two errors must be shown
  expect(screen.getByTestId(classComponentTestId)).toBeTruthy();
  expect(screen.getByTestId(functionalComponentTestId)).toBeTruthy();

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  expect(() => screen.getByTestId(classComponentTestId)).toThrowError();
  expect(() => screen.getByTestId(functionalComponentTestId)).toThrowError();

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
  unmount();
});
