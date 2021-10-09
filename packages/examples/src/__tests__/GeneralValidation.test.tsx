import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GeneralValidationUseCase1 } from "../GeneralValidationUseCase1";
import { GeneralValidationUseCase2 } from "../GeneralValidationUseCase2";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();
console.error = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

const testWorkflow = async (container: HTMLElement) => {
  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  testInvalidMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

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

  // input a valid text
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
};

beforeEach(() => {
  jest.resetAllMocks();
});

test("GeneralValidationUseCase1", async () => {
  const { container, unmount } = render(<GeneralValidationUseCase1 />);

  await testWorkflow(container);

  unmount();
});

test("GeneralValidationUseCase2", async () => {
  const { container, unmount } = render(<GeneralValidationUseCase2 />);

  await testWorkflow(container);

  unmount();
});
