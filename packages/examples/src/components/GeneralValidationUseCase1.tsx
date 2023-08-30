import { FC, FormController, Validation } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

export const GeneralValidationUseCase1 = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> validateOnChange {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <Validation
                            validation={(value) =>
                                (value === undefined || (typeof value === "string" && !value.trim())) &&
                                "Provide a valid text"
                            }
                        >
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $name="givenName"
                                    data-testid={DataTestId.GivenName}
                                    placeholder="Input a given name"
                                />
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $name="surname"
                                    data-testid={DataTestId.Surname}
                                    placeholder="Input a surname"
                                />
                            </FieldRow>
                        </Validation>

                        <FieldRowButtons>
                            <FC.Submit
                                data-testid={DataTestId.Submit}
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * Providing the validation as a parental element, it should show the same error for each
                            text input
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
