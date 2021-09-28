import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { wait } from "../../utils/utils";
import { SelectFieldOptionDisabled } from "../SelectFieldOptionDisabled";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const resetTestId = "reset";
const select1TestId = "select-1";
const select2TestId = "select-2";
const submitTestId = "submit";

test("SelectFieldOptionDisabled", async () => {
  const { container } = render(<SelectFieldOptionDisabled />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // options should be disabled
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[1]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[2]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[3]
  ).toBeDisabled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // one error must be shown
  testInvalidMessage(container, 1);

  // select an option
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "Option 2-2" }
  });

  // one error must be shown
  testInvalidMessage(container, 1);

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).not.toHaveBeenCalled();

  // second option should not be disabled
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[1]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[2]
  ).not.toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[3]
  ).toBeDisabled();

  // select an option
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "Option 1-2" }
  });

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    select1: "Option 1-2",
    select2: "Option 2-2"
  });

  // select an empty option
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "" }
  });

  // one error must be shown
  testInvalidMessage(container, 1);

  // select previous option
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "Option 1-2" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // select an option
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "option-2-3" }
  });

  // third option should not be disabled
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[1]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[2]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[3]
  ).not.toBeDisabled();

  // one error must be shown

  testInvalidMessage(container, 1);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);

  // select an option
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "option-1-3" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({
    select1: "option-1-3",
    select2: "option-2-3"
  });

  // select an option

  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "" }
  });

  await wait(1000);

  // one error must be shown
  testInvalidMessage(container, 1);

  // options should be disabled
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[1]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[2]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[3]
  ).toBeDisabled();

  // select an option
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "Option 2-1" }
  });

  // first option should not be disabled
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[1]
  ).not.toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[2]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[3]
  ).toBeDisabled();

  // one error must be shown
  testInvalidMessage(container, 1);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // options should be disabled
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[1]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[2]
  ).toBeDisabled();
  expect(
    screen.getByTestId(select1TestId).querySelectorAll("option")[3]
  ).toBeDisabled();

  // errors should not be shown
  testInvalidMessage(container, 0);

  // select an option
  fireEvent.change(screen.getByTestId(select2TestId), {
    target: { value: "Option 2-1" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // select an option
  fireEvent.change(screen.getByTestId(select1TestId), {
    target: { value: "Option 1-1" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);
});
