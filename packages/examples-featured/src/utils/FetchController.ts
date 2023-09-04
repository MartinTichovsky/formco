export class FetchController<Form> {
    private controllers: { [K in keyof Form]?: AbortController } = {};

    abortLastFetch(id: keyof Form) {
        this.controllers[id]?.abort();
    }

    getSignal(id: keyof Form) {
        return this.controllers[id]?.signal;
    }

    registerAbortController(id: keyof Form) {
        this.controllers[id] = new AbortController();
    }
}
