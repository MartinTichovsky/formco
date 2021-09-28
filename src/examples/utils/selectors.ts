import { cnInvalidMessage, cnValidMessage } from "../../constants";

export const testInvalidMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${cnInvalidMessage}`).length).toBe(count);
};

export const testValidMessage = (container: HTMLElement, count: number) => {
  expect(container.querySelectorAll(`.${cnValidMessage}`).length).toBe(count);
};
