import { Controller, FormFields } from "formco";
import { action, makeObservable, observable } from "mobx";

const defaultValue = `> submitted: false`;

export class LogStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    log = defaultValue;

    @action
    onSubmit<T extends FormFields<T>>(fields: unknown, controller: Controller<T>) {
        this.log = `> submitted: true\n> isValid: ${controller.isValid}\n> result: ${JSON.stringify(fields)}
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
