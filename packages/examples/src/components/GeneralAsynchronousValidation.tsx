import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { wait } from "../utils/utils";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    radio: string;
    surname: string;
}

export const GeneralAsynchronousValidation = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> validateOnChange {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="givenName"
                                $validation={(value) => ({
                                    content: TestingContent.Pending,
                                    promise: async function () {
                                        await wait(2000);
                                        return {
                                            isValid: !!value?.trim(),
                                            content: !value?.trim() ? (
                                                <span style={{ color: "red" }}>Provide a valid given name</span>
                                            ) : (
                                                <span style={{ color: "green" }}>Given name is valid</span>
                                            )
                                        };
                                    }
                                })}
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                $validation={(value) => ({
                                    content: TestingContent.Pending,
                                    promise: async function () {
                                        await wait(2000);
                                        return {
                                            isValid: !!value?.trim(),
                                            content: !value?.trim() ? (
                                                <span style={{ color: "red" }}>Provide a valid surname</span>
                                            ) : (
                                                <span style={{ color: "green" }}>Surname is valid</span>
                                            )
                                        };
                                    }
                                })}
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $onClick={() => store.submitted()}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * The both input fields are validated using asynchronous action. This simulate calling API
                            for a validation. After input a value the promise action is called. Input an empty text to
                            show invalid result message, pending is set to 2s. When click on the submit button during
                            the pending, the submit button is disabled until all pending actions are done. The pending
                            text can be also replaced with HTML element, such as a loading icon.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
