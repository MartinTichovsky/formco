import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { Controller } from "../../controller";
import { PrivateController } from "../../private-controller";
import { getControllerProviderContext } from "../../providers";
import { getGeneratedValues } from "../../__tests__/utils/value-generator";
import { Condition } from "../Condition";
import { ConditionComponent } from "../ConditionComponent";

interface Form {
    input: string;
}

describe("Condition", () => {
    let controller: Controller<Form>;
    let privateController: PrivateController<Form>;

    const testId = "test-id";

    const testValidForm = (unmount: () => void) => {
        const useEffectHooks = collector.getReactHooks(ConditionComponent.name)?.getHooksByType("useEffect");

        // Should be rendered once and action should be called, by default is children not rendered
        expect(collector.getCallCount(ConditionComponent.name)).toBe(1);
        expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
        expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
        expect(useEffectHooks?.get(2)).toBeUndefined();
        expect(screen.queryByTestId(testId)).toBeNull();

        // onChange is trigered and the form is valid, it should re-render the component and show the children
        privateController.onChange();

        expect(collector.getCallCount(ConditionComponent.name)).toBe(2);
        expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
        expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
        expect(useEffectHooks?.get(2)).toBeUndefined();
        expect(screen.getByTestId(testId)).toBeTruthy();

        // set form values and make the form invalid, it should hide the children
        privateController["_fields"].input = {
            isDisabled: false,
            isValid: false,
            isValidated: true,
            isVisible: true,
            validationContent: "error",
            validationInProgress: false,
            validationToBeExecuted: false,
            value: undefined
        };

        privateController.onChange();
        expect(collector.getCallCount(ConditionComponent.name)).toBe(3);
        expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
        expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
        expect(useEffectHooks?.get(2)).toBeUndefined();
        expect(screen.queryByTestId(testId)).toBeNull();

        // unmount the component
        unmount();

        // unmount action should be called
        expect(useEffectHooks?.get(1)?.unmount).toBeCalledTimes(1);
    };

    beforeAll(() => {
        console.error = jest.fn();
    });

    beforeEach(() => {
        collector.reset();
        privateController = new PrivateController<Form>({ setFormControllerState: jest.fn() });
        controller = new Controller(privateController);
    });

    describe("Condition Element", () => {
        test("Providing wrong showIf should throw an error", () => {
            const values = getGeneratedValues(false, "function", "undefined");
            const context = getControllerProviderContext<Form>();

            values.forEach((value) => {
                expect(() => {
                    render(
                        <context.Provider value={privateController}>
                            <Condition controller={controller} showIf={value} />
                        </context.Provider>
                    );
                }).toThrowError();
            });
        });

        test("Providing wrong dynamicContent should throw an error", () => {
            const values = getGeneratedValues(false, "function", "undefined");
            const context = getControllerProviderContext<Form>();

            values.forEach((value) => {
                expect(() => {
                    render(
                        <context.Provider value={privateController}>
                            <Condition controller={controller} dynamicContent={value} />
                        </context.Provider>
                    );
                }).toThrowError();
            });
        });

        test("IfFormValid is undefined and showIf is undefined", () => {
            const context = getControllerProviderContext<Form>();

            render(
                <context.Provider value={privateController}>
                    <Condition controller={controller}>
                        <div data-testid={testId}></div>
                    </Condition>
                </context.Provider>
            );

            privateController.onChange();
            expect(screen.getByTestId(testId)).toBeTruthy();

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

            privateController.onChange();
            expect(screen.getByTestId(testId)).toBeTruthy();
        });
    });

    describe("ConditionComponent Element", () => {
        test("Default functionality", () => {
            render(
                <ConditionComponent controller={controller} privateController={privateController}>
                    <div data-testid={testId}></div>
                </ConditionComponent>
            );

            expect(screen.queryByTestId(testId)).toBeNull();
        });

        test("dynamicRender", () => {
            let num = 0;
            const TestComponent = () => {
                return <div data-testid={testId}>{++num}</div>;
            };

            render(
                <ConditionComponent controller={controller} dynamicRender privateController={privateController}>
                    <TestComponent />
                </ConditionComponent>
            );

            privateController.onChange();

            expect(screen.getByTestId(testId)).toHaveTextContent("1");

            privateController.onChange();

            expect(screen.getByTestId(testId)).toHaveTextContent("2");

            privateController.onChange();

            expect(screen.getByTestId(testId)).toHaveTextContent("3");
        });

        test("dynamicContent", () => {
            let num = 0;
            render(
                <ConditionComponent
                    controller={controller}
                    dynamicContent={() => <div data-testid={testId}>{++num}</div>}
                    privateController={privateController}
                />
            );

            privateController.onChange();

            expect(screen.getByTestId(testId)).toHaveTextContent("1");

            privateController.onChange();

            expect(screen.getByTestId(testId)).toHaveTextContent("2");

            privateController.onChange();

            expect(screen.getByTestId(testId)).toHaveTextContent("3");
        });

        test("IfFormValid is true and showIf is undefined", () => {
            const { unmount } = render(
                <ConditionComponent controller={controller} ifFormValid privateController={privateController}>
                    <div data-testid={testId}></div>
                </ConditionComponent>
            );

            testValidForm(unmount);
        });

        test("IfFormValid is undefined and showIf is set", () => {
            const showIf = jest.fn(() => {
                return privateController.isValid;
            });

            const { unmount } = render(
                <ConditionComponent controller={controller} privateController={privateController} showIf={showIf}>
                    <div data-testid={testId}></div>
                </ConditionComponent>
            );

            testValidForm(unmount);
        });

        test("IfFormValid is true and showIf is set - default", () => {
            const showIf = jest.fn(() => {
                return privateController.isValid;
            });

            const { unmount } = render(
                <ConditionComponent
                    controller={controller}
                    ifFormValid
                    privateController={privateController}
                    showIf={showIf}
                >
                    <div data-testid={testId}></div>
                </ConditionComponent>
            );

            testValidForm(unmount);
        });

        test("IfFormValid is true and showIf is set - custom", () => {
            const showIf = jest.fn(() => {
                return false;
            });

            render(
                <ConditionComponent
                    controller={controller}
                    ifFormValid
                    privateController={privateController}
                    showIf={showIf}
                >
                    <div data-testid={testId}></div>
                </ConditionComponent>
            );

            expect(screen.queryByTestId(testId)).toBeNull();

            const useEffectHooks = collector.getReactHooks(ConditionComponent.name)?.getHooksByType("useEffect");

            expect(collector.getCallCount(ConditionComponent.name)).toBe(1);
            expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
            expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
            expect(screen.queryByTestId(testId)).toBeNull();

            // the form is not valid because of the custom condition, the component shouldn't re-render
            privateController.onChange();
            expect(collector.getCallCount(ConditionComponent.name)).toBe(1);
            expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
            expect(useEffectHooks?.get(1)?.unmount).not.toBeCalled();
            expect(screen.queryByTestId(testId)).toBeNull();
        });
    });
});
