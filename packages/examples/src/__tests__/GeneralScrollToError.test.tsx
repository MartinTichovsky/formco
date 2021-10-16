import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GeneralScrollToError } from "../components/GeneralScrollToError";

console.log = jest.fn();

const checkboxTestId = "checkbox";
const givenNameTestId = "givenName";
const noteTestId = "note";
const radio1TestId = "radio-1";
const radio2TestId = "radio-2";
const resetTestId = "reset";
const selectTestId = "select";
const submitTestId = "submit";
const surnameTestId = "surname";

test("GeneralScrollToError", async () => {
  Element.prototype.scrollTo = jest.fn();
  render(<GeneralScrollToError />);

  expect(Element.prototype.scrollTo).not.toBeCalled();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // giveName should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(1);
  expect(screen.getByTestId(givenNameTestId)).toHaveFocus();

  // input a given name
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // surname should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(2);
  expect(screen.getByTestId(surnameTestId)).toHaveFocus();

  // input a surname
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond A" }
  });

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // note should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(3);
  expect(screen.getByTestId(noteTestId)).toHaveFocus();

  // input a note
  fireEvent.change(screen.getByTestId(noteTestId), {
    target: { value: "Note" }
  });

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // select should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(4);
  expect(screen.getByTestId(selectTestId)).toHaveFocus();

  // select an option
  fireEvent.change(screen.getByTestId(selectTestId), {
    target: { value: "Option 1" }
  });

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // the first radio should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(5);
  expect(screen.getByTestId(radio1TestId)).toHaveFocus();

  // select an option
  fireEvent.click(screen.getByTestId(radio1TestId));

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // checkbox should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(6);
  expect(screen.getByTestId(checkboxTestId)).toHaveFocus();

  // check the checkbox
  fireEvent.click(screen.getByTestId(checkboxTestId));

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // nothing should change
  expect(Element.prototype.scrollTo).toBeCalledTimes(6);

  // change the surname to hide the first option of radio
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // the second radio should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(7);
  expect(screen.getByTestId(radio2TestId)).toHaveFocus();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // givenName should have focus
  expect(Element.prototype.scrollTo).toBeCalledTimes(8);
  expect(screen.getByTestId(givenNameTestId)).toHaveFocus();
});
