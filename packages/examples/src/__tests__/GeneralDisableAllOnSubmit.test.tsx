import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GeneralDisableAllOnSubmit } from "../components/GeneralDisableAllOnSubmit";

console.log = jest.fn();

const givenNameTestId = "givenName";
const radio1TestId = "radio-1";
const radio2TestId = "radio-2";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

test("GeneralDisableAllOnSubmit", async () => {
  render(<GeneralDisableAllOnSubmit />);

  // all fields must not be disabled
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio2TestId)).not.toBeDisabled();

  // submit the form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  // all inputs must be disabled
  expect(screen.getByTestId(givenNameTestId)).toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).toBeDisabled();
  expect(screen.getByTestId(radio1TestId)).toBeDisabled();
  expect(screen.getByTestId(radio2TestId)).toBeDisabled();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // all inputs most not be disabled
  expect(screen.getByTestId(givenNameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(surnameTestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio1TestId)).not.toBeDisabled();
  expect(screen.getByTestId(radio2TestId)).not.toBeDisabled();
});
