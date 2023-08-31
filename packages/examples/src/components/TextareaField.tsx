import { Controller, FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    description: string;
    radio: string;
    surname: string;
}

const TextareaMessage = ({ children }: React.PropsWithChildren<{ controller: Controller<MyForm> }>) => {
    return <div>{children}</div>;
};

export const TextareaField = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Textarea
                                $controller={controller}
                                $initialValidation
                                $messageComponent={TextareaMessage}
                                $name="description"
                                $validation={(value) => {
                                    const maxLetters = 10;
                                    const lettersRemains = maxLetters - (value?.length || 0);

                                    return {
                                        isValid: (value?.length || 0) > 0 && lettersRemains >= 0,
                                        content:
                                            !value?.length && controller.isFormSubmitted ? (
                                                <span data-testid={DataTestId.Error} style={{ color: "red" }}>
                                                    You must type at least 1 character
                                                </span>
                                            ) : lettersRemains >= 0 ? (
                                                <span
                                                    data-testid={DataTestId.ValidText}
                                                    style={{ color: "green" }}
                                                >{`You can write ${lettersRemains} more character${
                                                    lettersRemains === 1 ? "" : "s"
                                                }`}</span>
                                            ) : (
                                                <span
                                                    data-testid={DataTestId.InvalidText}
                                                    style={{ color: "red" }}
                                                >{`You have written ${Math.abs(lettersRemains)} more character${
                                                    Math.abs(lettersRemains) === 1 ? "" : "s"
                                                } that is allowed`}</span>
                                            )
                                    };
                                }}
                                $validateOnChange
                                data-testid={DataTestId.Textarea}
                                placeholder={TestingContent.InputText}
                            />
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
                            * Basic textarea field functionality, text fields must be not empty and have no more than 10
                            letters.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
