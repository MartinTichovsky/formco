import { CN } from "formco";

export const testInvalidMessage = (container: HTMLElement, count: number) =>
    expect(container.querySelectorAll(`.${CN.InvalidMessage}`).length).toBe(count);

export const testValidMessage = (container: HTMLElement, count: number) =>
    expect(container.querySelectorAll(`.${CN.ValidMessage}`).length).toBe(count);
