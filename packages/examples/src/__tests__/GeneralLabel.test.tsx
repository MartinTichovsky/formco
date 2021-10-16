import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { GeneralLabel } from "../components/GeneralLabel";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const salutationTestId = "salutation";
const surnameTestId = "surname";

test("GeneralLabel", async () => {
  const { container } = render(<GeneralLabel />);

  // three labels must exist
  const labels = container.querySelectorAll("label");
  expect(labels.length).toBe(3);

  // click on the first label
  userEvent.click(screen.getByText("Salutation"));
  expect(screen.getByTestId(salutationTestId)).toHaveFocus();

  // click on the second label
  userEvent.click(screen.getByText("Given name"));
  expect(screen.getByTestId(givenNameTestId)).toHaveFocus();

  // click on the third label
  userEvent.click(screen.getByText("Surname"));
  expect(screen.getByTestId(surnameTestId)).toHaveFocus();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  fireEvent.click(screen.getByTestId(resetTestId));
});
