import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { Controller } from "../../controller";
import { PrivateController } from "../../private-controller";
import { getControllerProviderContext } from "../../providers";
import { getGeneratedValues } from "../../__tests__/utils/value-generator";
import { FormController } from "../FormController";
import { FormControllerComponent } from "../FormControllerComponent";

type Form = {
    input: string;
};

const testid = "test-id";

console.error = jest.fn();

beforeEach(() => {
    collector.reset();
});

describe("FormController", () => {
    describe("FormController Element", () => {
        test("Default functionality", () => {
            render(<FormController>{() => <div data-testid={testid}></div>}</FormController>);

            expect(screen.getByTestId(testid)).toBeTruthy();
        });

        test("Default functionality with validate on change", () => {
            render(<FormController validateOnChange>{() => <div data-testid={testid}></div>}</FormController>);

            expect(screen.getByTestId(testid)).toBeTruthy();
        });

        test("Providing wrong initialValues should throw an error", () => {
            const values = getGeneratedValues(false, "object", "class", "undefined");

            values.forEach((value) => {
                expect(() => {
                    render(
                        <FormController initialValues={value}>
                            {() => {
                                return <></>;
                            }}
                        </FormController>
                    );
                }).toThrowError();
            });
        });

        test("Providing wrong onSubmit should throw an error", () => {
            const values = getGeneratedValues(false, "function", "undefined");

            values.forEach((value) => {
                expect(() => {
                    render(
                        <FormController onSubmit={value}>
                            {() => {
                                return <></>;
                            }}
                        </FormController>
                    );
                }).toThrowError();
            });
        });
    });

    describe("FormControllerComponent Element", () => {
        test("Default functionality", () => {
            let controller: PrivateController<Form> | undefined;
            let renderCount = 0;

            const context = getControllerProviderContext<Form>();

            render(
                <FormControllerComponent<Form>>
                    {() => (
                        <context.Consumer>
                            {(createdController) => {
                                renderCount++;
                                controller = createdController;
                                return <div data-testid={testid}></div>;
                            }}
                        </context.Consumer>
                    )}
                </FormControllerComponent>
            );

            const useEffectHooks = collector.getReactHooks(FormControllerComponent.name)?.getHooksByType("useEffect");

            // must be rendered once and passed controller must not be undefined
            expect(collector.getCallCount(FormControllerComponent.name)).toBe(2);
            expect(renderCount).toBe(1);
            expect(controller).not.toBeUndefined();

            // first render should call the actions
            expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);

            // the test component must exist
            expect(screen.getByTestId(testid)).toBeTruthy();

            // a form must exist and submiting the form must return false
            const form = screen.getByRole("form");

            expect(form).toBeTruthy();
            expect(fireEvent.submit(form)).toBeFalsy();

            // reset the form
            act(() => controller!.resetForm());
            expect(renderCount).toBe(2);
            expect(collector.getCallCount(FormControllerComponent.name)).toBe(3);
            expect(useEffectHooks?.get(1)?.action).toBeCalledTimes(1);
        });
    });

    test("Mapped Fields", () => {
        type FormType = {
            age: string;
            checked: boolean;
            name: string;
            undefined: undefined;
        };

        const context = getControllerProviderContext<FormType>();

        render(
            <FormController<FormType> initialValues={{ age: 5 }}>
                {() => (
                    <context.Consumer>
                        {(privateController) => {
                            const controller = new Controller(privateController!);
                            privateController!.setFieldValue({ key: "age", value: "10" });

                            const fields = controller!.getMappedFields({
                                age: Number(),
                                checked: Boolean(),
                                name: String(),
                                undefined: undefined
                            });

                            expect(fields).toEqual({
                                age: 10,
                                checked: false,
                                name: "",
                                undefined: undefined
                            });

                            return <></>;
                        }}
                    </context.Consumer>
                )}
            </FormController>
        );
    });
});
