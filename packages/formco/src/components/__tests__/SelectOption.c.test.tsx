import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { Controller } from "../../controller";
import { PrivateController } from "../../private-controller";
import { getControllerProviderContext, SelectProvider } from "../../providers";
import { SelectOption } from "../fields/SelectOption";

type Form = {
    input: string;
    select: string;
};

let controller: Controller<Form>;
let privateController: PrivateController<Form>;
let selectRef: React.MutableRefObject<HTMLSelectElement | undefined>;

const defaultValue = "default value";
const testId = "test-id";
const testText = "Test text";

beforeEach(() => {
    collector.reset();
    jest.resetAllMocks();

    privateController = new PrivateController<Form>({
        setController: jest.fn()
    });
    controller = new Controller(privateController);
    selectRef = {
        current: { value: defaultValue }
    } as React.MutableRefObject<HTMLSelectElement | undefined>;
});

const checkUseEffectActions = () => {
    // useEffect should be called one times
    expect(
        collector
            .getReactHooks(SelectOption.name, {
                dataTestId: testId
            })
            ?.getHooksByType("useEffect")
            ?.get(1)?.action
    ).toBeCalledTimes(1);
};

describe("SelectOption", () => {
    test("Context is not provided", () => {
        const context = getControllerProviderContext<Form>();

        render(
            <context.Provider value={privateController}>
                <SelectOption $controller={controller} data-testid={testId}>
                    {testText}
                </SelectOption>
            </context.Provider>
        );

        // option should not be in the document
        expect(() => screen.getByTestId(testId)).toThrowError();
    });

    test("Default functionality", () => {
        const context = getControllerProviderContext<Form>();

        render(
            <context.Provider value={privateController}>
                <SelectProvider name="select" selectRef={selectRef}>
                    <SelectOption $controller={controller} data-testid={testId}>
                        {testText}
                    </SelectOption>
                </SelectProvider>
            </context.Provider>
        );

        // option should not be disabled
        expect(screen.getByTestId(testId)).not.toBeDisabled();
        expect(privateController.getFieldValue("select")).toBeUndefined();

        // the component should be rendered one times
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(1);

        checkUseEffectActions();

        // manually run onChange
        privateController.onChange();

        // the component should be rendered one times
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(1);

        checkUseEffectActions();

        // option should not be disabled
        expect(screen.getByTestId(testId)).not.toBeDisabled();
        expect(privateController.getFieldValue("select")).toBeUndefined();
    });

    test("DisableIf", async () => {
        const context = getControllerProviderContext<Form>();

        render(
            <context.Provider value={privateController}>
                <SelectProvider name="select" selectRef={selectRef}>
                    <SelectOption
                        $controller={controller}
                        data-testid={testId}
                        $disableIf={(fields) => !fields.input?.trim()}
                    >
                        {testText}
                    </SelectOption>
                </SelectProvider>
            </context.Provider>
        );

        // option should be disabled
        expect(screen.getByTestId(testId)).toBeDisabled();

        // the component should be rendered one times
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(1);

        checkUseEffectActions();

        // set input value
        act(() => {
            privateController.setFieldValue({
                key: "input",
                value: "some text"
            });
        });

        // check the render count
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(2);

        checkUseEffectActions();

        // option should not be disabled
        expect(screen.getByTestId(testId)).not.toBeDisabled();

        // set select value
        act(() => {
            privateController.setFieldValue({ key: "select", value: testText });
        });

        // check the render count
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(2);

        // set input value
        act(() => {
            privateController.setFieldValue({ key: "input", value: "" });
        });

        // option should be disabled
        expect(screen.getByTestId(testId)).toBeDisabled();

        // check the render count
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(3);

        await waitFor(async () => {
            expect(privateController.getFieldValue("select")).toBe(defaultValue);
        });
    });

    test("HideIf", async () => {
        const context = getControllerProviderContext<Form>();

        render(
            <context.Provider value={privateController}>
                <SelectProvider name="select" selectRef={selectRef}>
                    <SelectOption
                        $controller={controller}
                        data-testid={testId}
                        $hideIf={(fields) => !fields.input?.trim()}
                    >
                        {testText}
                    </SelectOption>
                </SelectProvider>
            </context.Provider>
        );

        // option should not be in the document
        expect(() => screen.getByTestId(testId)).toThrowError();

        // the component should be rendered one times
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(1);

        checkUseEffectActions();

        // set input value
        act(() => {
            privateController.setFieldValue({
                key: "input",
                value: "some text"
            });
        });

        // check the render count
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(2);

        checkUseEffectActions();

        // option should be in the document
        expect(screen.getByTestId(testId)).toBeTruthy();

        // set select value
        act(() => {
            privateController.setFieldValue({ key: "select", value: testText });
        });

        // check the render count
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(2);

        // set input value
        act(() => {
            privateController.setFieldValue({ key: "input", value: "" });
        });

        // option should not be in the document
        expect(() => screen.getByTestId(testId)).toThrowError();

        // check the render count
        expect(collector.getCallCount(SelectOption.name, { dataTestId: testId })).toBe(3);

        await waitFor(async () => {
            expect(privateController.getFieldValue("select")).toBe(defaultValue);
        });
    });

    test("registerAfterAll with more options", () => {
        const originSetFieldValue = privateController.setFieldValue;
        const context = getControllerProviderContext<Form>();

        privateController.setFieldValue = jest.fn((...props) => originSetFieldValue.call(privateController, ...props));

        render(
            <context.Provider value={privateController}>
                <SelectProvider name="select" selectRef={selectRef}>
                    <select ref={selectRef as React.RefObject<HTMLSelectElement>}>
                        <option></option>
                        <SelectOption $controller={controller} $hideIf={(fields) => !fields.input}>
                            Option 1
                        </SelectOption>
                        <SelectOption $controller={controller} $hideIf={(fields) => !fields.input}>
                            {testText}
                        </SelectOption>
                    </select>
                </SelectProvider>
            </context.Provider>
        );

        expect(privateController.setFieldValue).toBeCalledTimes(0);

        act(() => {
            originSetFieldValue.call(privateController, {
                key: "input",
                value: "value"
            });
        });

        expect(privateController.setFieldValue).toHaveBeenCalledTimes(1);
        expect(privateController.setFieldValue).lastCalledWith({
            key: "select",
            silent: true,
            value: ""
        });

        act(() => {
            originSetFieldValue.call(privateController, {
                key: "input",
                value: ""
            });
        });

        expect(privateController.setFieldValue).toHaveBeenCalledTimes(2);
        expect(privateController.setFieldValue).lastCalledWith({
            isValid: true,
            key: "select",
            value: ""
        });
    });

    test("registerAfterAll with single option", () => {
        const originSetFieldValue = privateController.setFieldValue;
        const context = getControllerProviderContext<Form>();

        privateController.setFieldValue = jest.fn((...props) => originSetFieldValue.call(privateController, ...props));

        render(
            <context.Provider value={privateController}>
                <SelectProvider name="select" selectRef={selectRef}>
                    <select ref={selectRef as React.RefObject<HTMLSelectElement>}>
                        <SelectOption $controller={controller} $hideIf={(fields) => !fields.input}>
                            {testText}
                        </SelectOption>
                    </select>
                </SelectProvider>
            </context.Provider>
        );

        expect(privateController.setFieldValue).toBeCalledTimes(0);

        act(() => {
            originSetFieldValue.call(privateController, {
                key: "input",
                value: "value"
            });
        });

        expect(privateController.setFieldValue).toHaveBeenCalledTimes(1);
        expect(privateController.setFieldValue).lastCalledWith({
            key: "select",
            silent: true,
            value: testText
        });

        act(() => {
            originSetFieldValue.call(privateController, {
                key: "input",
                value: ""
            });
        });

        expect(privateController.setFieldValue).toHaveBeenCalledTimes(2);
        expect(privateController.setFieldValue).lastCalledWith({
            isValid: true,
            key: "select",
            value: ""
        });
    });
});
