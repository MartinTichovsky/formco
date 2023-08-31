import * as React from "react";
import { FormControllerProps } from "./components/FormController.types";
import { Controller } from "./controller";
import {
    Action,
    AfterAll,
    ControllerOptions,
    ControllerProps,
    DefaultActiveRadioId,
    DefaultDisabledRadioId,
    DisableIf,
    ExecutePromise,
    FieldAdditionalProperties,
    Fields,
    FieldTypes,
    FormFields,
    HideIf,
    InitialValues,
    KeyType,
    OnChangeAction,
    OnDisable,
    OnDisableAction,
    OnSubmit,
    OnValidation,
    OnValidationCustom,
    PrivateControllerSetKey,
    PromiseQueue,
    SetDefaultIsDisabled,
    SetDefaultIsInvalid,
    SetDefaultIsNotVisible,
    SetFieldValue,
    SetIsDisabled,
    SetIsVisible,
    SubscribeValidator,
    Validation,
    ValidationContentResult,
    ValidationDependencies,
    ValidationQueue,
    ValidationResult,
    Validator,
    ValidatorResultAction,
    Value
} from "./private-controller.types";
import { wait } from "./utils/utils";

export class PrivateController<T extends FormFields<T>> {
    static uniqueIndex: number = 0;

    private _afterAll: AfterAll<T> = {
        disable: new Map(),
        validate: [],
        validateAll: new Map(),
        visible: new Map()
    };
    private _defaultActiveRadioId: DefaultActiveRadioId<T> = {};
    private _defaultDisabledRadioId: DefaultDisabledRadioId<T> = {};
    private _disableIf?: DisableIf<T>;
    private _fields: Fields<T> = {};
    private _hideIf?: HideIf<T>;
    private _initialRender = true;
    private _initialValues?: InitialValues<T>;
    private _isSubmitted = false;
    private _onChangeCounter = 0;
    private _onSubmit?: OnSubmit<T>;
    private _onValidation?: FormControllerProps<T>["onValidation"];
    private _scrolledToElement: boolean = false;
    private _setFormControllerState: React.Dispatch<React.SetStateAction<PrivateControllerSetKey>>;
    private _validateOnBlur;
    private _validateOnChange;
    private _validation?: Validation<T>;
    private _validationQueue: ValidationQueue<T> = {};

    private isSelectedListeners = new Map<string, Action>();
    private keyIndex: number;
    private onChangeListeners = new Set<OnChangeAction>();
    private onChangeKeyListeners = new Map<keyof T, Set<OnChangeAction>>();
    private onDisableListeners = new Set<OnDisable<T>>();
    private onDisableButtonListeners = new Set<OnDisableAction>();
    private onValidationListeners = new Set<OnValidation<T>>();
    private options?: ControllerOptions;
    private registeredKeys: KeyType<T>[] = [];
    private validationDependencies: ValidationDependencies<T> = {};
    private validatorListeners = new Map<keyof T, Validator>();

    public requiredInvalidMessage?: string | JSX.Element;
    public requiredValidMessage?: string | JSX.Element;

    constructor({
        disableIf,
        hideIf,
        initialValues,
        options,
        onSubmit,
        onValidation,
        requiredInvalidMessage,
        requiredValidMessage,
        setFormControllerState,
        silent,
        validateOnBlur = false,
        validateOnChange = false,
        validation
    }: ControllerProps<T>) {
        if (initialValues) {
            this._initialValues = initialValues;
            this.setInitialValues(initialValues);
        }
        if (onSubmit) {
            this._onSubmit = onSubmit;
        }

        this._disableIf = disableIf;
        this._hideIf = hideIf;
        this._setFormControllerState = setFormControllerState;
        this._onValidation = onValidation;
        this._validation = validation;
        this._validateOnBlur = validateOnBlur;
        this._validateOnChange = validateOnChange;

        this.options = options;
        this.requiredInvalidMessage = requiredInvalidMessage;
        this.requiredValidMessage = requiredValidMessage;

        this.keyIndex = silent ? PrivateController.uniqueIndex : PrivateController.uniqueIndex++;
    }

    get canScrollToElement() {
        if (this._scrolledToElement) {
            return false;
        }

        this._scrolledToElement = true;
        return true;
    }

    get fields(): Partial<T> {
        const result: Partial<T> = {};

        for (let key in this._fields) {
            if (this._fields[key]!.isVisible) {
                const value = this._fields[key]!.value;

                (result[key] as Value) =
                    this.options?.trimValues && value && typeof value === "string" ? value.trim() : value;
            }
        }

        return result;
    }

    get isSubmitted() {
        return this._isSubmitted;
    }

    get isValid() {
        for (let key in this._fields) {
            if (!this._fields[key]!.isDisabled && this._fields[key]!.isVisible && !this._fields[key]!.isValid) {
                return false;
            }
        }

        return true;
    }

    get key() {
        return this.keyIndex;
    }

    get scrollToError() {
        return this.options?.scrollToError;
    }

    private afterAll() {
        if (this._onChangeCounter === 0) {
            Object.values(this._afterAll).forEach((member) => {
                member.forEach((action) => {
                    action();
                });
            });

            this._afterAll = {
                disable: new Map(),
                validate: [],
                validateAll: new Map(),
                visible: new Map()
            };
        }
    }

    public canFieldBeValidated(key: keyof T, includeOnBlur?: boolean) {
        return !!(
            this._fields[key]?.validateOnChange ||
            this._validateOnChange ||
            this.isSubmitted ||
            (includeOnBlur && (this._validateOnBlur || this._fields[key]?.validateOnBlur))
        );
    }

    public deleteField(key: keyof T, id?: string) {
        if (!(key in this._fields)) {
            return;
        }

        if (id && this._fields[key]?.options?.has(id)) {
            this._fields[key]!.options!.delete(id);
        }

        if (this._fields[key]?.activeId === id) {
            this._fields[key]!.activeId = undefined;
        }

        if (!this._fields[key]?.options?.size) {
            delete this._fields[key];
        }
    }

    private disableButtons(disable: boolean) {
        this.onDisableButtonListeners.forEach((listener) => {
            listener(disable);
        });
    }

    public disableFields(disable: boolean) {
        this.onDisableListeners.forEach((listener) => {
            if (
                (listener.key in this._fields && this._fields[listener.key]?.isDisabled === false) ||
                !(listener.key in this._fields)
            ) {
                listener.action(disable);
            }
        });

        this.disableButtons(disable);
    }

    private disabledRadiosExceptDefault(key: keyof T) {
        if (!this._defaultActiveRadioId[key] || !this._fields[key]?.options) {
            return false;
        }

        const entries = Object.fromEntries(this._fields[key]!.options!.entries());

        for (let id in entries) {
            if (id === this._defaultActiveRadioId[key]) {
                continue;
            }

            if (!entries[id].isDisabled) {
                return false;
            }
        }

        return true;
    }

    private executePromise<K extends keyof T>({
        blurAction,
        key,
        onSuccess,
        promise,
        queueId,
        withWait
    }: ExecutePromise<K>) {
        if (queueId !== this.getQueueId(key)) {
            return;
        }

        this._fields[key]!.validationInProgress = true;

        if (blurAction || withWait) {
            this.onChange(key);
        }

        promise()
            .then((result) => {
                if (queueId !== this.getQueueId(key) || !result) {
                    return;
                }

                this._fields[key] = {
                    ...this._fields[key],
                    isValid: result.isValid,
                    isValidated: true,
                    validationContent: result.content,
                    validationInProgress: false,
                    validationToBeExecuted: false
                };

                if (onSuccess) {
                    onSuccess(result);
                }
            })
            .catch(() => {
                if (queueId !== this.getQueueId(key)) {
                    return;
                }

                this._fields[key] = {
                    ...this._fields[key],
                    validationInProgress: false,
                    validationToBeExecuted: false
                };
            });
    }

    private getDependencyList(key: keyof T, dependencyList: (keyof T)[] = [key]) {
        for (let _key in this.validationDependencies) {
            if (this.validationDependencies[_key]?.has(key) && !dependencyList.includes(_key)) {
                dependencyList.push(_key);
                this.getDependencyList(_key, dependencyList);
            }
        }

        return dependencyList.slice(1);
    }

    public getDisableCondition(key: keyof T) {
        return this._disableIf && key in this._disableIf ? this._disableIf[key] : undefined;
    }

    public getField(key: keyof T) {
        return key in this._fields ? this._fields[key] : undefined;
    }

    public getFieldValue<K extends keyof T>(key: K): T[K] | undefined {
        return key in this._fields ? (this._fields[key]!.value as T[K]) : undefined;
    }

    public getHideCondition(key: keyof T) {
        return this._hideIf && key in this._hideIf ? this._hideIf[key] : undefined;
    }

    public getObservedFields<K extends keyof T>(key: K) {
        return this._initialRender && Proxy !== undefined
            ? new Proxy<Partial<T>>(
                  {},
                  {
                      get: (_, prop) => {
                          if (!(key in this.validationDependencies)) {
                              this.validationDependencies[key] = new Set();
                          }

                          if (prop !== key) {
                              this.validationDependencies[key]?.add(prop as K);
                          }

                          return this._fields[prop]?.isVisible ? this._fields[prop]?.value : undefined;
                      }
                  }
              )
            : this.fields;
    }

    private getInitialValue<K extends keyof T>(key: K): T[K] | undefined {
        if (!this._initialValues || !(key in this._initialValues)) {
            return undefined;
        }

        if (typeof this._initialValues[key] === "number") {
            return this._initialValues[key]?.toString() as T[K];
        }

        return this._initialValues[key] as T[K];
    }

    private getQueueId(key: keyof T) {
        return key in this._validationQueue ? this._validationQueue[key] : 0;
    }

    public getOnValidationCondition<R>(key: keyof T) {
        return (
            this._onValidation
                ? typeof this._onValidation === "object" && key in this._onValidation
                    ? this._onValidation[key]
                    : typeof this._onValidation === "function"
                    ? this._onValidation
                    : undefined
                : undefined
        ) as OnValidationCustom<R> | undefined;
    }

    public getValidationCondition(key: keyof T) {
        return this._validation && key in this._validation ? this._validation[key] : undefined;
    }

    private getValidationHasPromise(validationResult: ValidationResult) {
        return typeof validationResult === "object" && validationResult !== null && "promise" in validationResult;
    }

    private getValidationResultBoolean(validationResult: ValidationResult) {
        return (
            !validationResult ||
            (typeof validationResult === "object" &&
                validationResult !== null &&
                (("isValid" in validationResult && validationResult.isValid) || "promise" in validationResult))
        );
    }

    public getValidationResultContent(validationResult: ValidationResult) {
        if (
            validationResult !== undefined &&
            typeof validationResult === "object" &&
            validationResult !== null &&
            ("isValid" in validationResult || "promise" in validationResult)
        ) {
            return "isValid" in validationResult ? validationResult.content : undefined;
        }
        return validationResult;
    }

    public isFieldValid(key: keyof T) {
        return this._fields[key]?.isValid;
    }

    public isFieldValidationInProgress(key: keyof T) {
        return this._fields[key]?.validationInProgress;
    }

    public isFieldValidationToBeExecuted(key: keyof T) {
        return this._fields[key]?.validationToBeExecuted;
    }

    public initialRenderDone() {
        this._initialRender = false;
    }

    public isOnFirstPosition(key: keyof T, id?: string) {
        if (!this._fields[key]?.options) {
            return true;
        }

        const options = Object.fromEntries(this._fields[key]!.options!.entries());

        for (let _id in options) {
            if (options[_id].isVisible) {
                return _id === id;
            }
        }

        return false;
    }

    private isSelectedAction(id?: string) {
        if (id) {
            this.isSelectedListeners?.get(id)?.();
        }
    }

    private isValidationInProgress() {
        for (let key in this._fields) {
            if (this._fields[key]!.validationInProgress) {
                return true;
            }
        }

        return false;
    }

    public onChange(key?: keyof T) {
        this._onChangeCounter++;

        if (key !== undefined && this.onChangeKeyListeners.has(key)) {
            this.onChangeKeyListeners.get(key)?.forEach((listener) => {
                listener(this.isValid);
            });
        }

        this.onChangeListeners.forEach((listener) => {
            listener(this.isValid);
        });

        this._onChangeCounter--;
        this.afterAll();
    }

    private promiseQueue({ blurAction, key, onSuccess, promise, wait }: PromiseQueue<keyof T>) {
        const queueId = this.registerQueueId(key);

        if (wait) {
            this._fields[key]!.validationToBeExecuted = true;

            setTimeout(
                () =>
                    this.executePromise({
                        blurAction,
                        key,
                        onSuccess,
                        promise,
                        queueId,
                        withWait: true
                    }),
                wait
            );
        } else {
            this.executePromise({
                blurAction,
                key,
                onSuccess,
                promise,
                queueId,
                withWait: false
            });
        }
    }

    public registerKey(key: keyof T, type: FieldTypes) {
        const existingItems = this.registeredKeys.filter((item) => item.key === key);

        this.registeredKeys.push({ key, type });

        return !existingItems.length
            ? true
            : type === "radio"
            ? !existingItems.some((item) => item.type !== "radio")
            : false;
    }

    public registerOption(key: keyof T, id: string) {
        if (!(key in this._fields)) {
            this._fields[key] = {
                isDisabled: false,
                isTouched: false,
                isValid: true,
                isValidated: false,
                isVisible: true,
                validationInProgress: false,
                validationToBeExecuted: false,
                validationContent: undefined,
                value: this.getInitialValue(key)
            };
        }

        if (!this._fields[key]?.options) {
            this._fields[key]!.options = new Map();
        }

        if (!this._fields[key]!.options!.has(id)) {
            this._fields[key]!.options!.set(id, {
                isDisabled: false,
                isVisible: true
            });
        }
    }

    private registerQueueId(key: keyof T) {
        if (!(key in this._validationQueue)) {
            this._validationQueue[key] = 0;
        }

        return ++this._validationQueue[key]!;
    }

    public registerValidationDependencies(key: keyof T, dependencies: (keyof T)[]) {
        if (!(key in this.validationDependencies)) {
            this.validationDependencies[key] = new Set();
        }

        for (let _key of dependencies) {
            if (key !== _key) {
                this.validationDependencies[key]?.add(_key);
            }
        }
    }

    public resetForm(silent = false) {
        this._setFormControllerState((prevState) => ({ key: ++prevState.key, silent }));
        this._isSubmitted = false;
    }

    public setDefaultActiveRadioId(key: keyof T, id?: string) {
        if (key in this._fields) {
            this._fields[key]!.activeId = id;
        }

        this._defaultActiveRadioId[key] = id;
    }

    public setDefaultIsDisabled({ id, isValidated, key, type, validationResult }: SetDefaultIsDisabled<T>) {
        if (key in this._fields) {
            this._fields[key] = {
                ...this._fields[key],
                isDisabled: true,
                isValidated: isValidated && !this.getValidationHasPromise(validationResult),
                isValid: this.getValidationResultBoolean(validationResult),
                validationContent: this.getValidationResultContent(validationResult)
            };
        } else {
            this._fields[key] = {
                isDisabled: true,
                isTouched: false,
                isValid: this.getValidationResultBoolean(validationResult),
                isValidated: isValidated && !this.getValidationHasPromise(validationResult),
                isVisible: true,
                validationContent: this.getValidationResultContent(validationResult),
                validationInProgress: false,
                validationToBeExecuted: false,
                value: this.getInitialValue(key)
            };
        }

        if (type !== "radio" || !id) {
            return;
        }

        if (!this._fields[key]!.options) {
            this._fields[key]!.options = new Map();
        }

        if (this._fields[key]!.options?.has(id)) {
            this._fields[key]!.options!.get(id)!.isDisabled = true;
        } else {
            this._fields[key]!.options!.set(id, {
                isDisabled: true,
                isVisible: true
            });
        }

        this._fields[key]!.isDisabled = Array.from(this._fields[key]!.options!.values()).every(
            (item) => item.isDisabled
        );

        if (!(key in this._defaultDisabledRadioId)) {
            this._defaultDisabledRadioId[key] = [];
        }

        this._defaultDisabledRadioId[key]!.push(id);
    }

    public setDefaultIsValid({ initialValidation, isValidated, key, type, validationResult }: SetDefaultIsInvalid<T>) {
        if (key in this._fields) {
            this._fields[key] = {
                ...this._fields[key],
                isValid: this.getValidationResultBoolean(validationResult),
                isValidated: !initialValidation && isValidated && !this.getValidationHasPromise(validationResult),
                validationContent: this.getValidationResultContent(validationResult)
            };
        } else {
            this._fields[key] = {
                isDisabled: false,
                isTouched: false,
                isValid: this.getValidationResultBoolean(validationResult),
                isValidated: !initialValidation && isValidated && !this.getValidationHasPromise(validationResult),
                isVisible: true,
                validationContent: this.getValidationResultContent(validationResult),
                validationInProgress: false,
                validationToBeExecuted: false,
                value: this.getInitialValue(key)
            };
        }

        if (type === "radio" && !this._fields[key]!.options) {
            this._fields[key]!.options = new Map();
        }
    }

    public setDefaultIsNotVisible({ id, isValidated, key, type, validationResult, value }: SetDefaultIsNotVisible<T>) {
        if (key in this._fields && this._fields[key]!.value !== undefined && this._fields[key]!.value === value) {
            this._afterAll.validate.push(() => {
                this._fields[key]!.value = undefined;
                this.validateAll(key, true);
            });
        }

        if (key in this._fields) {
            this._fields[key] = {
                ...this._fields[key],
                isValid: this.getValidationResultBoolean(validationResult),
                isValidated: isValidated && !this.getValidationHasPromise(validationResult),
                isVisible: false,
                validationContent: this.getValidationResultContent(validationResult)
            };
        } else {
            this._fields[key] = {
                isDisabled: false,
                isTouched: false,
                isValid: this.getValidationResultBoolean(validationResult),
                isValidated: isValidated && !this.getValidationHasPromise(validationResult),
                isVisible: false,
                validationContent: this.getValidationResultContent(validationResult),
                validationInProgress: false,
                validationToBeExecuted: false,
                value: this.getInitialValue(key)
            };
        }

        if (type !== "radio" || !id) {
            return;
        }

        if (!this._fields[key]?.options) {
            this._fields[key]!.options = new Map();
        }

        if (this._fields[key]!.options?.has(id)) {
            this._fields[key]!.options!.get(id)!.isVisible = false;
        } else {
            this._fields[key]!.options?.set(id, {
                isDisabled: true,
                isVisible: false
            });
        }

        this._fields[key]!.isVisible = Array.from(this._fields[key]!.options!.values()).some((item) => item.isVisible);
    }

    public setFieldProperties(key: keyof T, props: FieldAdditionalProperties) {
        if (key in this._fields) {
            this._fields[key] = {
                ...this._fields[key],
                ...props
            };
        } else {
            this._fields[key] = {
                ...props,
                activeId: undefined,
                isDisabled: false,
                isTouched: false,
                isValid: true,
                isValidated: false,
                isVisible: true,
                validationContent: undefined,
                validationInProgress: false,
                validationToBeExecuted: false,
                value: undefined
            };
        }
    }

    public setFieldValue({ id, isTouched, isValid, key, silent, value }: SetFieldValue<T>) {
        if (key in this._fields) {
            this._fields[key] = {
                ...this._fields[key],
                activeId: id,
                isTouched: isTouched === undefined ? this._fields[key]!.isTouched : isTouched,
                isValid: isValid === undefined ? this._fields[key]!.isValid : isValid,
                isValidated: isValid === undefined ? false : true,
                validationContent: isValid === undefined ? this._fields[key]!.validationContent : undefined,
                validationInProgress: false,
                validationToBeExecuted: false,
                value
            };
        } else {
            this._fields[key] = {
                activeId: id,
                isDisabled: false,
                isTouched,
                isValid: isValid === undefined ? true : isValid,
                isValidated: isValid === undefined ? false : true,
                isVisible: true,
                validationContent: undefined,
                validationInProgress: false,
                validationToBeExecuted: false,
                value
            };
        }

        if (isValid !== undefined) {
            this.validateQueue({
                action: () => {
                    this.validateActions(key, this._fields[key]?.validationContent);
                    this.validateAllDependencies(key, silent);
                    this.onChange(key);
                    this.validationListeners(key);
                },
                key,
                silent
            });
            return;
        }

        if (this.canFieldBeValidated(key) && !this._fields[key]!.isDisabled && this._fields[key]!.isVisible) {
            this.validateQueue({
                action: () => {
                    this.validateAll(key, silent);
                    this.validateAllDependencies(key, silent);
                    this.onChange(key);
                    this.validationListeners(key);
                },
                key,
                silent
            });
        } else if (!this._fields[key]!.isDisabled && this._fields[key]!.isVisible) {
            this.validateAll(key, true);
            this.validateAllDependencies(key, true);
            this.onChange(key);
            this.validationListeners(key);
        } else {
            this.onChange(key);
            this.validationListeners(key);
        }
    }

    private setInitialValues(initialValues: InitialValues<T>) {
        for (let key in initialValues) {
            this._fields[key] = {
                isDisabled: false,
                isTouched: false,
                isValid: true,
                isValidated: false,
                isVisible: true,
                validationContent: undefined,
                validationInProgress: false,
                validationToBeExecuted: false,
                value: this.getInitialValue(key)
            };
        }
    }

    public setIsDisabled({ id, isDisabled, key, type }: SetIsDisabled<T>) {
        if (
            this._fields[key] === undefined ||
            (type !== "radio" && this._fields[key]!.isDisabled === isDisabled) ||
            (id && this._fields[key]!.options && this._fields[key]!.options!.get(id)?.isDisabled === isDisabled)
        ) {
            return;
        }

        let disable = isDisabled;

        if (type === "radio" && id && this._fields[key]!.options?.has(id)) {
            this._fields[key]!.options!.get(id)!.isDisabled = isDisabled;
            disable = Array.from(this._fields[key]!.options!.values()).every((item) => item.isDisabled);
            this.setIsDisabledAfterAll(key);
        }

        let value =
            disable || this._fields[key]!.options === undefined
                ? this.getInitialValue(key)
                : isDisabled && this._fields[key]!.activeId === id && id !== this._defaultActiveRadioId[key]
                ? undefined
                : this._fields[key]!.value;

        if (
            isDisabled &&
            this._fields[key]!.activeId === id &&
            this._defaultActiveRadioId[key] &&
            this._defaultDisabledRadioId[key]?.includes(this._defaultActiveRadioId[key]!)
        ) {
            value = this.getInitialValue(key);
            this.isSelectedAction(this._defaultActiveRadioId[key]);
        }

        this._fields[key] = {
            ...this._fields[key],
            isDisabled: disable,
            isValidated: false,
            value
        };

        if (type === "radio") {
            this._afterAll.validateAll.set(key, () => {
                this.validateAll(key, true);
            });
        } else {
            this.validateAll(key, true);
        }

        this.onChange(key);
    }

    private setIsDisabledAfterAll(key: keyof T) {
        this._afterAll.disable.set(key, () => {
            if (this.disabledRadiosExceptDefault(key)) {
                this._fields[key] = {
                    ...this._fields[key],
                    activeId: this._defaultActiveRadioId[key],
                    value: this.getInitialValue(key)
                };
                this.validateAll(key, true);
                this.isSelectedAction(this._defaultActiveRadioId[key]);
            }
        });
    }

    public setIsVisible({ id, isVisible, key, type }: SetIsVisible<T>) {
        if (
            this._fields[key] === undefined ||
            (type !== "radio" && this._fields[key]?.isVisible === isVisible) ||
            this._fields[key]?.options?.get(id!)?.isVisible === isVisible
        ) {
            return;
        }

        let visible = isVisible;

        if (type === "radio" && id && this._fields[key]!.options && this._fields[key]!.options?.has(id)) {
            this._fields[key]!.options!.get(id)!.isVisible = isVisible;
            visible = Array.from(this._fields[key]!.options!.values()).some((item) => item.isVisible);
        }

        if (!isVisible && this._fields[key]!.activeId === id) {
            this._fields[key]!.activeId = undefined;
            this._fields[key]!.isValidated = false;
            this._fields[key]!.value = undefined;
        }

        if (isVisible && this._fields[key]!.value === undefined) {
            this._fields[key]!.isValidated = false;
        }

        if (type !== "radio" && visible && this._fields[key]!.value === undefined) {
            this._fields[key]!.value = this.getInitialValue(key);
        }

        if (type === "radio" && !this._afterAll.visible.has(key)) {
            this.setIsVisibleAfterAll(key);
        }

        this._fields[key] = {
            ...this._fields[key],
            isVisible: visible
        };

        if (type === "radio") {
            this.onChange(key);
            return;
        }

        if (
            visible &&
            this.canFieldBeValidated(key) &&
            (!this._fields[key]!.isValid || this._fields[key]!.validationContent !== undefined)
        ) {
            this.validateAll(key);
        } else if (visible) {
            this.validateAll(key, true);
        } else {
            this._fields[key]!.isValid = true;
        }

        this.onChange(key);
    }

    private setIsVisibleAfterAll(key: keyof T) {
        this._afterAll.visible.set(key, () => {
            if (
                this._fields[key]!.value === undefined &&
                this._fields[key]!.options?.get(this._defaultActiveRadioId?.[key]!)?.isVisible === true
            ) {
                this._fields[key]!.value = this.getInitialValue(key);
                this._fields[key] = {
                    ...this._fields[key],
                    activeId: this._defaultActiveRadioId?.[key]
                };

                this.validateAll(key, !this.canFieldBeValidated(key));
                this.validationListenersOnChange(key);
                this.isSelectedAction(this._defaultActiveRadioId[key]!);
            } else if (
                this._fields[key]!.value === undefined &&
                this._fields[key]!.options?.get(this._defaultActiveRadioId?.[key]!)?.isVisible === false
            ) {
                this.validateAll(key, !this.canFieldBeValidated(key));
                this.validationListenersOnChange(key);
            } else {
                this.validateAll(key, !this._fields[key]?.isTouched);
            }
        });
    }

    public async submit() {
        this._isSubmitted = true;
        this._scrolledToElement = false;
        this.validate();

        if (this.isValidationInProgress()) {
            this.disableButtons(true);

            while (this.isValidationInProgress()) {
                await wait(200);
            }

            this.disableButtons(false);
        }

        if (this.isSubmitted && this._onSubmit && this.isValid) {
            this._onSubmit(this.fields, new Controller(this));
        }

        return this;
    }

    public subscribeIsSelected(id: string, action: Action) {
        this.isSelectedListeners.set(id, action);
    }

    public subscribeOnChange(action: OnChangeAction, key?: keyof T) {
        if (key === undefined) {
            this.onChangeListeners.add(action);
            return;
        }

        if (!this.onChangeKeyListeners.has(key)) {
            this.onChangeKeyListeners.set(key, new Set());
        }

        this.onChangeKeyListeners.get(key)?.add(action);
    }

    public subscribeOnDisable(listener: OnDisable<T>) {
        this.onDisableListeners.add(listener);
    }

    public subscribeOnDisableButton(action: OnDisableAction) {
        this.onDisableButtonListeners.add(action);
    }

    public subscribeOnValidation(listener: OnValidation<T>) {
        this.onValidationListeners.add(listener);
    }

    public subscribeValidator({ action, id, key, type, validation }: SubscribeValidator<T>) {
        if (!this.validatorListeners.has(key)) {
            this.validatorListeners.set(key, {
                action: undefined,
                actions: type === "radio" ? new Set() : undefined,
                validation
            });
        }

        if (type === "radio") {
            this.validatorListeners.get(key)!.actions!.add(action);
        } else {
            this.validatorListeners.get(key)!.action = action;
        }

        if (!(key in this._fields)) {
            this._fields[key] = {
                isDisabled: false,
                isTouched: false,
                isValid: false,
                isValidated: false,
                isVisible: true,
                validationContent: undefined,
                validationInProgress: false,
                validationToBeExecuted: false,
                value: this.getInitialValue(key)
            };
        }

        if (type === "radio" && !this._fields[key]?.options) {
            this._fields[key]!.options = new Map();
        }

        if (type === "radio" && id) {
            this._fields[key]!.options?.set(id, {
                isDisabled: false,
                isVisible: true
            });
        }
    }

    public unsubscribeIsSelected(id: string) {
        this.isSelectedListeners.delete(id);
    }

    public unsubscribeOnChange(action: OnChangeAction, key?: keyof T) {
        if (key === undefined) {
            this.onChangeListeners.delete(action);
        } else if (this.onChangeKeyListeners.has(key)) {
            this.onChangeKeyListeners.get(key)?.delete(action);
        }
    }

    public unsubscribeOnDisable(listener: OnDisable<T>) {
        this.onDisableListeners.delete(listener);
    }

    public unsubscribeOnDisableButton(action: OnDisableAction) {
        this.onDisableButtonListeners.delete(action);
    }

    public unsubscribeOnValidation(listener: OnValidation<T>) {
        this.onValidationListeners.delete(listener);
    }

    public unsubscribeValidator(key: keyof T, action: ValidatorResultAction) {
        if (!this.validatorListeners.has(key)) {
            return;
        }

        const validator = this.validatorListeners.get(key);

        if (validator?.actions) {
            validator.actions.delete(action);
        }

        if ((validator?.actions && validator?.actions.size === 0) || validator?.action) {
            this.validatorListeners.delete(key);
        }
    }

    public validate(force?: boolean) {
        this.validatorListeners.forEach((validator, key) => {
            if (this._fields[key] === undefined || this._fields[key]!.isDisabled || !this._fields[key]!.isVisible) {
                return;
            }

            if (!force && this._fields[key]!.isValidated && !this._fields[key]!.isValid) {
                this.validateActions(key, this._fields[key]!.validationContent, true);
            }

            if (!force && this._fields[key]!.isValidated) {
                this.validateActions(key, this._fields[key]!.validationContent, true);
                return;
            }

            const validationResult = validator.validation();

            let isValid: boolean;
            let validationContent: ValidationContentResult;

            if (typeof validationResult === "object" && validationResult !== null && "promise" in validationResult) {
                isValid = false;
                validationContent = validationResult.content;

                this.promiseQueue({
                    key,
                    onSuccess: (result) => {
                        this.onChange(key);
                        this.validateActions(key, result.content, true);
                        this.validationListeners(key);
                    },
                    promise: validationResult.promise,
                    wait: validationResult.wait
                });
            } else if (
                typeof validationResult === "object" &&
                validationResult !== null &&
                "isValid" in validationResult
            ) {
                isValid = validationResult.isValid;
                validationContent = validationResult.content;
            } else {
                isValid = !validationResult;
                validationContent = validationResult;
            }

            this._fields[key] = {
                ...this._fields[key],
                validationContent,
                isValid,
                isValidated: true
            };

            this.validateActions(key, validationContent, true);
        });

        this._afterAll.validate.push(() => {
            this.validationListeners();
        });

        this.onChange();
    }

    private validateActions(key: keyof T, validationContent: ValidationContentResult, submitAction: boolean = false) {
        const validator = this.validatorListeners.get(key);
        validator?.actions?.forEach((action) => {
            action(validationContent, submitAction);
        });
        validator?.action?.(validationContent, submitAction);
    }

    public validateAll(key: keyof T, silent?: boolean, blurAction?: boolean) {
        const validator = this.validatorListeners.get(key);

        if (!validator) {
            return;
        }

        const validationResult = validator.validation();

        let isValid: boolean;
        let isValidated = true;
        let validationContent: ValidationContentResult;

        if (typeof validationResult === "object" && validationResult !== null && "promise" in validationResult) {
            isValid = false;
            isValidated = false;
            validationContent = validationResult.content;

            this.promiseQueue({
                key,
                blurAction,
                onSuccess: (result) => {
                    if (!silent && !this._fields[key]!.isDisabled && this._fields[key]!.isVisible) {
                        this.onChange(key);
                        this.validateActions(key, result.content);
                        this.validationListeners(key);
                    }
                },
                promise: validationResult.promise,
                wait: blurAction ? undefined : validationResult.wait
            });
        } else if (typeof validationResult === "object" && validationResult !== null && "isValid" in validationResult) {
            isValid = validationResult.isValid;
            validationContent = validationResult.content;
        } else {
            isValid = !validationResult;
            validationContent = validationResult;
        }

        this._fields[key] = {
            ...this._fields[key],
            validationContent,
            isValid,
            isValidated
        };

        if (!silent && !this._fields[key]!.isDisabled && this._fields[key]!.isVisible) {
            this.validateActions(key, validationContent);
        }
    }

    private validateAllDependencies(key: keyof T, silent?: boolean) {
        const dependencies = this.getDependencyList(key);

        for (let _key of dependencies) {
            this.validateAll(_key, silent);
        }
    }

    public validateOnBlur(key: keyof T) {
        if (!(key in this._fields)) {
            return;
        }

        if (!this._fields[key]!.isValidated && !this._fields[key]!.validationInProgress) {
            this.registerQueueId(key);
            this.validateAll(key, !this.canFieldBeValidated(key, true), true);
            this.validationListeners(key);
        } else if (this._fields[key]!.isValidated && (this._validateOnBlur || this._fields[key]!.validateOnBlur)) {
            this.onChange(key);
            this.validateActions(key, this._fields[key]!.validationContent);
            this.validationListeners(key);
        }
    }

    private validateQueue({
        action,
        key,
        queueId,
        silent
    }: {
        action: () => void;
        key: keyof T;
        queueId?: number;
        silent?: boolean;
    }) {
        if (silent) {
            action();
            return;
        }

        if (!queueId && this.options?.validationTimeout) {
            this.validateActions(key, undefined);
            queueId = this.registerQueueId(key);

            setTimeout(
                () =>
                    this.validateQueue({
                        action,
                        key,
                        queueId,
                        silent
                    }),
                this.options?.validationTimeout
            );
        } else if (!queueId || queueId === this.getQueueId(key)) {
            action();
        }
    }

    private validationListeners(key?: keyof T) {
        for (let listener of Array.from(this.onValidationListeners.values())) {
            if (listener.key in this._fields && (!key || key === listener.key)) {
                listener.action(
                    !this._fields[listener.key]!.isDisabled &&
                        this._fields[listener.key]!.isVisible &&
                        this.canFieldBeValidated(listener.key),
                    this._fields[listener.key]!.isValid,
                    this._fields[listener.key]?.validationContent
                );
            }
        }
    }

    private validationListenersOnChange(key: keyof T) {
        if (this.canFieldBeValidated(key)) {
            this.validationListeners(key);
        }
    }
}
