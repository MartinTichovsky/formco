import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react";
import React from "react";
import { SubmitComponent } from "../components/SubmitComponent";
import { wait } from "../utils/utils";
import { testInvalidMessage } from "./utils/selectors";

console.error = jest.fn();
console.log = jest.fn();

const pendingText = "pending...";
const givenNameTestId = "givenName";
const resetTestId = "reset";
const submitClassComponentTestId = "class-submit";
const submitFunctionalComponentTestId = "functional-submit";
const surnameTestId = "surname";

test("SubmitComponent", async () => {
  const { container } = render(<SubmitComponent />);

  // errors should not be shown
  testInvalidMessage(container, 0);

  // the buttons must not have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    pendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(pendingText);

  // click on the class submit component
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitClassComponentTestId));
  });

  // two errors should be shown
  testInvalidMessage(container, 2);

  // reset the form
  fireEvent.click(screen.getByTestId(resetTestId));

  // errors should not be shown
  testInvalidMessage(container, 0);

  // click on the functional submit component
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));
  });

  // two errors must be shown
  testInvalidMessage(container, 2);

  // input a valid text
  fireEvent.change(screen.getByTestId(givenNameTestId), {
    target: { value: "James" }
  });

  // one error should be shown
  testInvalidMessage(container, 1);

  // input valid text
  fireEvent.change(screen.getByTestId(surnameTestId), {
    target: { value: "Bond" }
  });

  // errors should not be shown
  testInvalidMessage(container, 0);

  // click on the class submit component
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitClassComponentTestId));
  });

  expect(screen.getByTestId(submitClassComponentTestId)).toHaveTextContent(
    pendingText
  );

  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(pendingText);

  // check the onSubmit action
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // click on the functional submit component
  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));
  });

  // the functional component button must have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).toHaveTextContent(
    pendingText
  );

  expect(screen.getByTestId(submitFunctionalComponentTestId)).toHaveTextContent(
    pendingText
  );

  // check the onSubmit action
  expect(console.log).toHaveBeenCalledTimes(2);
  expect(console.log).toHaveBeenCalledWith({
    givenName: "James",
    surname: "Bond"
  });

  // wait for delay
  await act(async () => {
    await wait(2000);
  });

  // after timout the submit buttons must not have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    pendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(pendingText);

  await waitFor(async () => {
    // click on the buttons to cause pending again
    fireEvent.click(screen.getByTestId(submitFunctionalComponentTestId));
    fireEvent.click(screen.getByTestId(submitClassComponentTestId));
  });

  // reset the form to unmount the elements and create new ones
  fireEvent.click(screen.getByTestId(resetTestId));

  // wait for delay
  await act(async () => {
    await wait(2000);
  });

  // no console errors should be caused
  expect(console.error).not.toBeCalled();

  // the submit buttons must not have the pending text
  expect(screen.getByTestId(submitClassComponentTestId)).not.toHaveTextContent(
    pendingText
  );
  expect(
    screen.getByTestId(submitFunctionalComponentTestId)
  ).not.toHaveTextContent(pendingText);
}, 10000);
