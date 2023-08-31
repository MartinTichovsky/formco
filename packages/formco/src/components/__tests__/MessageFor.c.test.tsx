import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { Controller } from "../../controller";
import { PrivateController } from "../../private-controller";
import { getControllerProviderContext } from "../../providers";
import { MessageFor } from "../MessageFor";

interface Form {
    input: string;
}

describe("MessageFor", () => {
    let controller: Controller<Form>;
    let privateController: PrivateController<Form>;

    const testText1 = "Test text 1";
    const testText2 = "Test text 2";

    const checkUseEffectActions = () => {
        // useEffect should be called one times
        expect(collector.getReactHooks(MessageFor.name)?.getHooksByType("useEffect")?.get(1)?.action).toBeCalledTimes(
            1
        );

        // the unmount action should not to be called
        expect(collector.getReactHooks(MessageFor.name)?.getHooksByType("useEffect")?.get(1)?.unmount).not.toBeCalled();

        // more useEffects should not exist
        expect(collector.getReactHooks(MessageFor.name)?.getHooksByType("useEffect").get(2)).toBeUndefined();
    };

    beforeEach(() => {
        collector.reset();
        privateController = new PrivateController<Form>({
            setFormControllerState: jest.fn()
        });
        controller = new Controller(privateController);

        privateController["_fields"].input = {
            isDisabled: false,
            isValid: true,
            isValidated: true,
            isVisible: true,
            validationContent: undefined,
            validationInProgress: false,
            validationToBeExecuted: false,
            value: undefined
        };
    });

    test("Default functionality - isValid is undefined, equal to false", () => {
        const context = getControllerProviderContext<Form>();

        const { unmount } = render(
            <context.Provider value={privateController}>
                <MessageFor controller={controller} name="input">
                    {testText1}
                </MessageFor>
            </context.Provider>
        );

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // the component should be rendered one times
        expect(collector.getCallCount(MessageFor.name)).toBe(1);

        checkUseEffectActions();

        // the controller should have registered one onValidateMessage listener
        expect(privateController["onValidationListeners"].size).toBe(1);

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(1);

        checkUseEffectActions();

        privateController["_fields"].input!.isValid = false;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document because form is not submited and validateOnChange is false
        expect(screen.queryByText(testText1)).toBeNull();

        privateController["_validateOnChange"] = true;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should be in the document
        expect(screen.getByText(testText1)).toBeTruthy();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(2);

        checkUseEffectActions();

        privateController["_validateOnChange"] = false;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(3);

        checkUseEffectActions();

        privateController["_isSubmitted"] = true;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should be in the document
        expect(screen.getByText(testText1)).toBeTruthy();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(4);

        checkUseEffectActions();

        privateController["_fields"].input!.isDisabled = true;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(5);

        checkUseEffectActions();

        privateController["_fields"].input!.isDisabled = false;
        privateController["_fields"].input!.isVisible = false;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(5);

        checkUseEffectActions();

        unmount();

        // the unmount action should be called
        expect(collector.getReactHooks(MessageFor.name)?.getHooksByType("useEffect")?.get(1)?.unmount).toBeCalled();
    });

    test("IsValid is true, show message only for valid fields", () => {
        const context = getControllerProviderContext<Form>();

        const { unmount } = render(
            <context.Provider value={privateController}>
                <MessageFor controller={controller} isValid={true} name="input">
                    {testText1}
                </MessageFor>
            </context.Provider>
        );

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // the component should be rendered one times
        expect(collector.getCallCount(MessageFor.name)).toBe(1);

        checkUseEffectActions();

        // the controller should have registered one onValidationMessage listener
        expect(privateController["onValidationListeners"].size).toBe(1);

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(1);

        checkUseEffectActions();

        privateController["_validateOnChange"] = true;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should be in the document
        expect(screen.getByText(testText1)).toBeTruthy();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(2);

        checkUseEffectActions();

        privateController["_validateOnChange"] = false;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(3);

        checkUseEffectActions();

        privateController["_isSubmitted"] = true;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should be in the document
        expect(screen.getByText(testText1)).toBeTruthy();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(4);

        checkUseEffectActions();

        privateController["_fields"].input!.isValid = false;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(5);

        checkUseEffectActions();

        privateController["_fields"].input!.isValid = true;
        privateController["_fields"].input!.isDisabled = true;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(5);

        checkUseEffectActions();

        privateController["_fields"].input!.isDisabled = false;
        privateController["_fields"].input!.isVisible = false;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // check render count
        expect(collector.getCallCount(MessageFor.name)).toBe(5);

        checkUseEffectActions();

        unmount();

        // the unmount action should be called
        expect(collector.getReactHooks(MessageFor.name)?.getHooksByType("useEffect")?.get(1)?.unmount).toBeCalled();
    });

    test("Passing text from validation", () => {
        const context = getControllerProviderContext<Form>();

        render(
            <context.Provider value={privateController}>
                <MessageFor controller={controller} isValid={true} name="input" />
            </context.Provider>
        );

        privateController["_fields"].input!.validationContent = testText1;
        privateController["_validateOnChange"] = true;

        // the test message should not be in the document
        expect(screen.queryByText(testText1)).toBeNull();

        // the component should be rendered one times
        expect(collector.getCallCount(MessageFor.name)).toBe(1);

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should be in the document
        expect(screen.getByText(testText1)).toBeTruthy();

        privateController["_fields"].input!.validationContent = testText2;

        // manually call private method
        act(() => {
            privateController["validationListeners"]("input");
        });

        // the test message should be in the document
        expect(screen.getByText(testText2)).toBeTruthy();
    });
});
