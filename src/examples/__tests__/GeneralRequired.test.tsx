import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { CN } from "../../constants";
import { GeneralRequired } from "../GeneralRequired";
import { testInvalidMessage } from "../utils/selectors";

console.log = jest.fn();

const checkbox1TestId = "checkbox-1";
const checkbox2TestId = "checkbox-2";
const input1TestId = "input-1";
const input2TestId = "input-2";
const radio1TestId = "radio-1";
const radio2TestId = "radio-2";
const radio3TestId = "radio-3";
const radioField1TestId = "radio-field-row-1";
const radioField2TestId = "radio-field-row-2";
const radioField3TestId = "radio-field-row-3";
const resetTestId = "reset";
const selectTestId = "select";
const submitTestId = "submit";
const textareaTestId = "textarea";

const allFieldsMustHaveInvalidClassName = () => {
  expect(screen.getByTestId(input1TestId)).toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(input2TestId)).toHaveClass(CN.InvalidField);
  expect(() => screen.getByTestId(radio1TestId)).toThrowError();
  expect(screen.getByTestId(radio2TestId)).toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(radio3TestId)).toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(selectTestId)).toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(textareaTestId)).toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(checkbox1TestId)).toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(checkbox2TestId)).toHaveClass(CN.InvalidField);
};

const checkStarCount = (container: HTMLElement) => {
  expect(container.querySelectorAll(`.${CN.RequiredStar}`).length).toBe(7);
};

const expectNotTohaveClasses = (testId: string) => {
  expect(screen.getByTestId(testId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(testId)).not.toHaveClass(CN.ValidField);
};

const expectToBeInvalid = (testId: string) => {
  expect(screen.getByTestId(testId)).toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(testId)).not.toHaveClass(CN.ValidField);
};

const expectToBeValid = (testId: string) => {
  expect(screen.getByTestId(testId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(testId)).toHaveClass(CN.ValidField);
};

const noInvalidClassNamesAreProvided = () => {
  expect(screen.getByTestId(input1TestId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(input2TestId)).not.toHaveClass(CN.InvalidField);
  expect(() => screen.getByTestId(radio1TestId)).toThrowError();
  expect(screen.getByTestId(radio2TestId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(radio3TestId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(selectTestId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(textareaTestId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(checkbox1TestId)).not.toHaveClass(CN.InvalidField);
  expect(screen.getByTestId(checkbox2TestId)).not.toHaveClass(CN.InvalidField);
};

const noValidClassNamesAreProvided = () => {
  expect(screen.getByTestId(input1TestId)).not.toHaveClass(CN.ValidField);
  expect(screen.getByTestId(input2TestId)).not.toHaveClass(CN.ValidField);
  expect(screen.getByTestId(radio2TestId)).not.toHaveClass(CN.ValidField);
  expect(screen.getByTestId(radio3TestId)).not.toHaveClass(CN.ValidField);
  expect(screen.getByTestId(selectTestId)).not.toHaveClass(CN.ValidField);
  expect(screen.getByTestId(textareaTestId)).not.toHaveClass(CN.ValidField);
  expect(screen.getByTestId(checkbox1TestId)).not.toHaveClass(CN.ValidField);
  expect(screen.getByTestId(checkbox2TestId)).not.toHaveClass(CN.ValidField);
};

const submitInvalidForm = async () => {
  // submit invalid form
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).not.toBeCalled();
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("GeneralRequired", () => {
  test("Validate on change", async () => {
    const { container } = render(<GeneralRequired />);

    // stars must be in the document
    checkStarCount(container);

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check invalid class names
    noInvalidClassNamesAreProvided();

    // check valid class names
    noValidClassNamesAreProvided();

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // first radio option should have a star not the others
    expect(
      screen.getByTestId(radioField1TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeNull();
    expect(
      screen.getByTestId(radioField2TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeTruthy();
    expect(
      screen.getByTestId(radioField3TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeNull();

    // input an empty values
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: " " }
    });

    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: " " }
    });

    fireEvent.change(screen.getByTestId(textareaTestId), {
      target: { value: " " }
    });

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeInvalid(input1TestId);
    expectToBeInvalid(input2TestId);
    expect(() => screen.getByTestId(radio1TestId)).toThrowError();
    expectNotTohaveClasses(radio2TestId);
    expectNotTohaveClasses(radio3TestId);
    expectNotTohaveClasses(selectTestId);
    expectToBeInvalid(textareaTestId);
    expectNotTohaveClasses(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bon" }
    });

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // one error should be shown
    testInvalidMessage(container, 1);

    // check fields
    expectToBeInvalid(input1TestId);
    expectToBeInvalid(input2TestId);
    expect(() => screen.getByTestId(radio1TestId)).toThrowError();
    expectNotTohaveClasses(radio2TestId);
    expectNotTohaveClasses(radio3TestId);
    expectNotTohaveClasses(selectTestId);
    expectToBeInvalid(textareaTestId);
    expectNotTohaveClasses(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // input  values
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });

    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    fireEvent.change(screen.getByTestId(textareaTestId), {
      target: { value: "Description" }
    });

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectNotTohaveClasses(radio1TestId);
    expectNotTohaveClasses(radio2TestId);
    expectNotTohaveClasses(radio3TestId);
    expectNotTohaveClasses(selectTestId);
    expectToBeValid(textareaTestId);
    expectNotTohaveClasses(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    fireEvent.click(screen.getByTestId(radio1TestId));

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectNotTohaveClasses(selectTestId);
    expectToBeValid(textareaTestId);
    expectNotTohaveClasses(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // select an option
    fireEvent.change(screen.getByTestId(selectTestId), {
      target: { value: "Option 1" }
    });

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectNotTohaveClasses(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // select an empty option
    fireEvent.change(screen.getByTestId(selectTestId), {
      target: { value: "" }
    });

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // one error should be shown
    testInvalidMessage(container, 1);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeInvalid(selectTestId);
    expectToBeValid(textareaTestId);
    expectNotTohaveClasses(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // select an option
    fireEvent.change(screen.getByTestId(selectTestId), {
      target: { value: "option-3" }
    });

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectNotTohaveClasses(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // check a checkbox
    fireEvent.click(screen.getByTestId(checkbox1TestId));

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectToBeValid(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // uncheck a checkbox
    fireEvent.click(screen.getByTestId(checkbox1TestId));

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // one error should be shown
    testInvalidMessage(container, 1);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectToBeInvalid(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // check a checkbox
    fireEvent.click(screen.getByTestId(checkbox1TestId));

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectToBeValid(checkbox1TestId);
    expectNotTohaveClasses(checkbox2TestId);

    // check a checkbox
    fireEvent.click(screen.getByTestId(checkbox2TestId));

    // submit button must be disabled
    expect(screen.getByTestId(submitTestId)).not.toBeDisabled();

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectToBeValid(checkbox1TestId);
    expectToBeValid(checkbox2TestId);

    // submit valid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    // check the onSubmit action
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).lastCalledWith({
      checkbox1: true,
      checkbox2: true,
      description: "Description",
      givenName: "James",
      radio: "Option 1",
      select: "option-3",
      surname: "Bond"
    });

    fireEvent.click(screen.getByTestId(resetTestId));

    // stars must be in the document
    checkStarCount(container);

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check invalid class names
    noInvalidClassNamesAreProvided();

    // check valid class names
    noValidClassNamesAreProvided();
  });

  test("Validate on submit", async () => {
    const { container } = render(
      <GeneralRequired
        disabledByDefault={false}
        disableIfNotValid={false}
        validateOnChange={false}
      />
    );

    // stars must be in the document
    checkStarCount(container);

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check invalid class names
    noInvalidClassNamesAreProvided();

    // check valid class names
    noValidClassNamesAreProvided();

    // input a value
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: " " }
    });

    // input a value
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: " " }
    });

    // input a value
    fireEvent.change(screen.getByTestId(textareaTestId), {
      target: { value: " " }
    });

    // errors should not be shown
    testInvalidMessage(container, 0);

    // check invalid class names
    noInvalidClassNamesAreProvided();

    // check valid class names
    noValidClassNamesAreProvided();

    // first radio option should have a star not the others
    expect(
      screen.getByTestId(radioField1TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeNull();
    expect(
      screen.getByTestId(radioField2TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeTruthy();
    expect(
      screen.getByTestId(radioField3TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeNull();

    await submitInvalidForm();

    // check invalid class names
    allFieldsMustHaveInvalidClassName();

    // check valid class names
    noValidClassNamesAreProvided();

    // input a value
    fireEvent.change(screen.getByTestId(input1TestId), {
      target: { value: "James" }
    });

    // three errors should be shown
    testInvalidMessage(container, 3);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeInvalid(input2TestId);
    expectToBeInvalid(radio1TestId);
    expectToBeInvalid(radio2TestId);
    expectToBeInvalid(radio3TestId);
    expectToBeInvalid(selectTestId);
    expectToBeInvalid(textareaTestId);
    expectToBeInvalid(checkbox1TestId);
    expectToBeInvalid(checkbox2TestId);

    // first radio option should have a star not the others
    expect(
      screen.getByTestId(radioField1TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeTruthy();
    expect(
      screen.getByTestId(radioField2TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeNull();
    expect(
      screen.getByTestId(radioField3TestId).querySelector(`.${CN.RequiredStar}`)
    ).toBeNull();

    await submitInvalidForm();

    // input a value
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bon" }
    });

    // four errors should be shown
    testInvalidMessage(container, 4);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeInvalid(input2TestId);
    expectToBeInvalid(radio1TestId);
    expectToBeInvalid(radio2TestId);
    expectToBeInvalid(radio3TestId);
    expectToBeInvalid(selectTestId);
    expectToBeInvalid(textareaTestId);
    expectToBeInvalid(checkbox1TestId);
    expectToBeInvalid(checkbox2TestId);

    await submitInvalidForm();

    // input a value
    fireEvent.change(screen.getByTestId(input2TestId), {
      target: { value: "Bond" }
    });

    // three errors should be shown
    testInvalidMessage(container, 3);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeInvalid(radio1TestId);
    expectToBeInvalid(radio2TestId);
    expectToBeInvalid(radio3TestId);
    expectToBeInvalid(selectTestId);
    expectToBeInvalid(textareaTestId);
    expectToBeInvalid(checkbox1TestId);
    expectToBeInvalid(checkbox2TestId);

    // select a radio
    fireEvent.click(screen.getByTestId(radio2TestId));

    // two errors should be shown
    testInvalidMessage(container, 2);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeInvalid(selectTestId);
    expectToBeInvalid(textareaTestId);
    expectToBeInvalid(checkbox1TestId);
    expectToBeInvalid(checkbox2TestId);

    await submitInvalidForm();

    // select an option
    fireEvent.change(screen.getByTestId(selectTestId), {
      target: { value: "Option 1" }
    });

    // one error should be shown
    testInvalidMessage(container, 1);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeInvalid(textareaTestId);
    expectToBeInvalid(checkbox1TestId);
    expectToBeInvalid(checkbox2TestId);

    await submitInvalidForm();

    // input a value
    fireEvent.change(screen.getByTestId(textareaTestId), {
      target: { value: "Description" }
    });

    // one error should be shown
    testInvalidMessage(container, 1);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectToBeInvalid(checkbox1TestId);
    expectToBeInvalid(checkbox2TestId);

    // check a checkbox
    fireEvent.click(screen.getByTestId(checkbox1TestId));

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectToBeValid(checkbox1TestId);
    expectToBeInvalid(checkbox2TestId);

    // check a checkbox
    fireEvent.click(screen.getByTestId(checkbox2TestId));

    // no errors should be shown
    testInvalidMessage(container, 0);

    // check fields
    expectToBeValid(input1TestId);
    expectToBeValid(input2TestId);
    expectToBeValid(radio1TestId);
    expectToBeValid(radio2TestId);
    expectToBeValid(radio3TestId);
    expectToBeValid(selectTestId);
    expectToBeValid(textareaTestId);
    expectToBeValid(checkbox1TestId);
    expectToBeValid(checkbox2TestId);

    // submit valid form
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId(submitTestId));
    });

    // check the onSubmit action
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).lastCalledWith({
      checkbox1: true,
      checkbox2: true,
      description: "Description",
      givenName: "James",
      radio: "Option 2",
      select: "Option 1",
      surname: "Bond"
    });
  });
});
