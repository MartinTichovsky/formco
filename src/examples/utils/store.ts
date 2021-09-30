import { action, makeObservable, observable } from "mobx";
import { Controller, FormFields } from "../..";

const defaultValue = `> submitted: false`;

export class LogStore {
  constructor() {
    makeObservable(this);
  }

  @observable
  log = defaultValue;

  @action
  onSubmit<T extends FormFields<T>>(
    fields: unknown,
    controller: Controller<T>
  ) {
    this.log = `> submitted: true\n> isValid: ${
      controller.isValid
    }\n> result: ${JSON.stringify(fields)}
    `;
  }

  @action
  submitted() {
    this.log = this.log.replace(defaultValue, "> submitted: true");
  }

  @action
  reset() {
    this.log = defaultValue;
  }
}
