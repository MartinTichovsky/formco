import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldHiddenUseCase2 } from "../TextFieldHiddenUseCase2";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const salutationTestId = "salutation";
const submitTestId = "submit";
const surnameTestId = "surname";

beforeEach(() => {
  console.info(expect.getState().testPath);
});

test("TextFieldHiddenUseCase2", async () => {
  const { container } = render(<TextFieldHiddenUseCase2 />);

  // the first and the third input must not be in the document
  expect(() => screen.getByTestId(salutationTestId)).toThrowError();
  expect(screen.getByTestId(givenNameTestId)).toBeTruthy();
  expect(() => screen.getByTestId(surnameTestId)).toThrowError();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // the first and the third input must not be in the document
  expect(() => screen.getByTestId(salutationTestId)).toThrowError();
  expect(screen.getByTestId(givenNameTestId)).toBeTruthy();
  expect(() => screen.getByTestId(surnameTestId)).toThrowError();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // the first input must not be in the document and the submit button must be disabled
  expect(() => screen.getByTestId(salutationTestId)).toThrowError();
  expect(screen.getByTestId(givenNameTestId)).toBeTruthy();
  expect(screen.getByTestId(surnameTestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: " " }
  });

  // the first input must not be in the document and the submit button must be disabled
  expect(() => screen.getByTestId(salutationTestId)).toThrowError();
  expect(screen.getByTestId(givenNameTestId)).toBeTruthy();
  expect(screen.getByTestId(surnameTestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // all fields must be in the document
  expect(screen.getByTestId(salutationTestId)).toBeTruthy();
  expect(screen.getByTestId(givenNameTestId)).toBeTruthy();
  expect(screen.getByTestId(surnameTestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(salutationTestId), {
    target: { value: " " }
  });

  // all fields must be in the document
  expect(screen.getByTestId(salutationTestId)).toBeTruthy();
  expect(screen.getByTestId(givenNameTestId)).toBeTruthy();
  expect(screen.getByTestId(surnameTestId)).toBeTruthy();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(console.log).toBeCalledTimes(3);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: " ",
    surname: "Bond"
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input a text
  fireEvent.change(screen.getByTestId(salutationTestId), {
    target: { value: "Mr." }
  });

  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(4);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: "Mr.",
    surname: "Bond"
  });

  fireEvent.click(screen.getByTestId(resetTestId));
});
