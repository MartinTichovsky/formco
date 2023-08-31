import { FC, FormController, MessageFor } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    surname: string;
}

export const firstNameErrorText = "Provide a valid given name";
export const surnameErrorText = "Provide a valid surname";

export const GeneralMessageForUseCase1 = (props: Partial<React.ComponentProps<typeof FormController>>) => {
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
                                $name="firstName"
                                $validation={(value) => !value?.trim()}
                                data-testid={DataTestId.FirstName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <MessageFor controller={controller} name="firstName">
                                {firstNameErrorText}
                            </MessageFor>
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $hideMessage
                                $name="surname"
                                $validation={(value) => ({
                                    content: surnameErrorText,
                                    isValid: !!value?.trim()
                                })}
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>
                        <FieldRow>
                            <MessageFor controller={controller} name="surname" />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                data-testid={DataTestId.Submit}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * When a text field is not valid, error message outside the Input will be shown after
                            submit. The both inputs have different using. The first text is taken from context of
                            MessageFor component, the second text is taken from validation.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
