import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldDisabledUseCase1 } from "../TextFieldDisabledUseCase1";
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

test("TextFieldDisabledUseCase1", async () => {
  const { container, unmount } = render(<TextFieldDisabledUseCase1 />);

  // the first, the third input and the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // the first, the third input and the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

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

  // only the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).not.toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input an empty value should show an error
  fireEvent.change(screen.getByTestId(salutationTestId), {
    target: { value: " " }
  });

  // only the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).not.toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // input an empty value should disable all other inputs
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "" }
  });

  // the first, the third input and the submit button must be disabled
  expect(screen.getByTestId(salutationTestId)).toBeDisabled();
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).toBeDisabled();
  expect(screen.getByTestId(submitTestId)).toBeDisabled();

  // one error should be shown
  testInvalidMessage(container, 1);

  // fill all inputs
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });
  fireEvent.change(screen.getByTestId(salutationTestId), {
    target: { value: "Mr." }
  });

  // the submit button must not be disabled
  expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    givenName: "James",
    salutation: "Mr.",
    surname: "Bond"
  });

  fireEvent.click(screen.getByTestId(resetTestId));

  unmount();
});
