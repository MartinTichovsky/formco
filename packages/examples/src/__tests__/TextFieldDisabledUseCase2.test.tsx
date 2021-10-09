import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldDisabledUseCase2 } from "../TextFieldDisabledUseCase2";
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

test("TextFieldDisabledUseCase2", async () => {
  const { container, unmount } = render(<TextFieldDisabledUseCase2 />);

  // the first and the third input must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).toBeDisabled();
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

  // the first and the third input must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // the first input and the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // the first input and the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: " " }
  });

  // the first input and the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // all fields must not be disabled
  expect(screen.getByTestId(salutationTestId)).not.toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
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

  // all fields must not be disabled
  expect(screen.getByTestId(salutationTestId)).not.toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
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

  unmount();
});
