import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextFieldValidationDependencies } from "../TextFieldValidationDependencies";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();
console.warn = jest.fn();

const error1TestId = "error-1";
const error2TestId = "error-2";
const error3TestId = "error-3";

const givenNameTestId = "givenName";
const middleNameTestId = "middleName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

const testSuite = async (
  container: HTMLElement,
  submitForValidation: boolean = true
) => {
  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  if (submitForValidation) {
    // submit invalid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    // check the onSubmit action
    expect(console.warn).not.toBeCalled();

    // three errors should be shown
    testInvalidMessage(container, 3);

    // all errors should be shown
    expect(screen.getByTestId(error1TestId)).toBeTruthy();
    expect(screen.getByTestId(error2TestId)).toBeTruthy();
    expect(screen.getByTestId(error3TestId)).toBeTruthy();
  }

  // input a text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // three errors should be shown
  testInvalidMessage(container, 3);

  // all errors should be shown
  expect(screen.getByTestId(error1TestId)).toBeTruthy();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(screen.getByTestId(error3TestId)).toBeTruthy();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.warn).not.toBeCalled();

  // input a text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // first error should be shown
  expect(screen.getByTestId(error1TestId)).toBeTruthy();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.warn).not.toBeCalled();

  // input a text
  fireEvent.change(screen.getByTestId(middleNameTestId), {
    target: { value: "Ronald" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // submit valid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({
    givenName: "James",
    middleName: "Ronald",
    surname: "Bond"
  });

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  if (submitForValidation) {
    // submit invalid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    // three errors should be shown
    testInvalidMessage(container, 3);

    // all errors should be shown
    expect(screen.getByTestId(error1TestId)).toBeTruthy();
    expect(screen.getByTestId(error2TestId)).toBeTruthy();
    expect(screen.getByTestId(error3TestId)).toBeTruthy();
  }

  // input a text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  // two errors should  be shown
  expect(screen.getByTestId(error1TestId)).toBeTruthy();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // input a text
  fireEvent.change(screen.getByTestId(middleNameTestId), {
    target: { value: "Ronald" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // one error should  be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // input a text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  if (submitForValidation) {
    // submit invalid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });
  }

  // input a text
  fireEvent.change(screen.getByTestId(middleNameTestId), {
    target: { value: "Ronald" }
  });

  // two errors should  be shown
  testInvalidMessage(container, 2);

  // two errors should  be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(screen.getByTestId(error3TestId)).toBeTruthy();

  // input a text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // two errors should  be shown
  testInvalidMessage(container, 2);

  // two errors should  be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(screen.getByTestId(error2TestId)).toBeTruthy();
  expect(screen.getByTestId(error3TestId)).toBeTruthy();

  // input a text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // errors should not be shown
  expect(() => screen.getByTestId(error1TestId)).toThrowError();
  expect(() => screen.getByTestId(error2TestId)).toThrowError();
  expect(() => screen.getByTestId(error3TestId)).toThrowError();
};

beforeEach(() => {
  jest.resetAllMocks();
  console.info(expect.getState().testPath);
});

describe("TextFieldValidationDependencies", () => {
  test("Validation on submit", async () => {
    const { container, unmount } = render(<TextFieldValidationDependencies />);
    await testSuite(container);
    unmount();
  });

  test("Validation on change", async () => {
    const { container, unmount } = render(
      <TextFieldValidationDependencies validateOnChange />
    );

    await testSuite(container, false);
    unmount();
  });
});
