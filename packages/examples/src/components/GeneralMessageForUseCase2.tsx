import { FC, FormController, MessageFor } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

export const givenNameValidText = "Given name is valid";
export const surnameValidText = "Surname is valid";

export const GeneralMessageForUseCase2 = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $hideMessage
                                $name="givenName"
                                $validation={(value) => !value?.trim()}
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <MessageFor controller={controller} isValid={true} name="givenName">
                                {givenNameValidText}
                            </MessageFor>
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $hideMessage
                                $name="surname"
                                $validation={(value) => ({
                                    content: surnameValidText,
                                    isValid: !!value?.trim()
                                })}
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>
                        <FieldRow>
                            <MessageFor controller={controller} isValid={true} name="surname" />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * When a text field is valid, message outside the Input will be shown after submit. The both
                            inputs have different using. The first text is taken from context of MessageFor component,
                            the second text is taken from validation.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
