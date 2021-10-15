import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GeneralValidateOnBlur } from "../GeneralValidateOnBlur";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

const testSuite = async (container: HTMLElement) => {
  // errors should not be shown
  testInvalidMessage(container, 0);

  // blur on the input
  fireEvent.blur(screen.getByTestId(givenNameTestId));

  // one error should be shown
  testInvalidMessage(container, 1);

  // blur on the input
  fireEvent.blur(screen.getByTestId(surnameTestId));

  // two errors should be shown
  testInvalidMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // input an empty value
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: " " }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input an empty value
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: " " }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // input valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // blur on the input
  fireEvent.blur(screen.getByTestId(givenNameTestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // blur on the input
  fireEvent.blur(screen.getByTestId(surnameTestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({ givenName: "James", surname: "Bond" });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("GeneralValidateOnBlur", () => {
  test("Field", async () => {
    const { container } = render(
      <GeneralValidateOnBlur
        inputValidateOnBlur={true}
        validateOnBlur={false}
      />
    );

    await testSuite(container);
  });

  test("FormController", async () => {
    const { container } = render(<GeneralValidateOnBlur />);

    await testSuite(container);
  });
});
