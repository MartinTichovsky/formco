import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  GeneralMessageForUseCase2,
  givenNameValidText,
  surnameValidText
} from "../GeneralMessageForUseCase2";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

test("GeneralMessageForUseCase2", async () => {
  const { container, unmount } = render(<GeneralMessageForUseCase2 />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // text should be not in the document
  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });
  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // text should be not in the document
  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

  // click the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James Junior" }
  });

  expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

  // input an invalid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: " " }
  });

  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  expect(screen.queryByText(givenNameValidText)).toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).toBeInTheDocument();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  expect(screen.queryByText(givenNameValidText)).not.toBeInTheDocument();
  expect(screen.queryByText(surnameValidText)).not.toBeInTheDocument();

  unmount();
});
