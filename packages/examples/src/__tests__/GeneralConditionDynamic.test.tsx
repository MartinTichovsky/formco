import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GeneralConditionDynamic } from "../GeneralConditionDynamic";

console.log = jest.fn();
console.error = jest.fn();

const dynamicContentTestId = "dynamic-content";
const dynamicContextTestId = "dynamic-context";
const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitTestId = "submit";
const surnameTestId = "surname";

const getTestedGivenNameText = (name: string) =>
  `Your given name is: ${name}`.trim();
const getTesteSurnameText = (name: string) => `Your surname is: ${name}`.trim();

test("GeneralConditionDynamic", async () => {
  const { unmount } = render(<GeneralConditionDynamic />);

  // the default text should be visible
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).lastCalledWith({});

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "J" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("J")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "Ja" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("Ja")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  // click on the submit button
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitTestId));
  });

  // check the onSubmit action
  expect(console.log).toBeCalledTimes(2);
  expect(console.log).lastCalledWith({ givenName: "James" });

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "B" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("B")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bo" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("Bo")
  );

  // input a valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // test expected text
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("James")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("Bond")
  );

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // the default text should be visible
  expect(screen.getByTestId(dynamicContentTestId)).toHaveTextContent(
    getTestedGivenNameText("")
  );
  expect(screen.getByTestId(dynamicContextTestId)).toHaveTextContent(
    getTesteSurnameText("")
  );

  unmount();
});
