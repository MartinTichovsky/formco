import { action, makeObservable, observable } from "mobx";

export class MessageStore {
  constructor() {
    makeObservable(this);
  }

  @observable
  message: string | null = null;

  @action
  setMessage(message: string | null, timeout?: number) {
    this.message = message;

    if (timeout) {
      setTimeout(() => {
        this.setMessage(null);
      }, timeout);
    }
  }
}
