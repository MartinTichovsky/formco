import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    middleName: string;
    surname: string;
}

export const TextFieldValidationDependencies = ({
    validateOnChange = false,
    ...props
}: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm>
                {...props}
                onSubmit={(fields) => console.log(fields)}
                validateOnChange={validateOnChange}
            >
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="givenName"
                                $validation={(_, fields) =>
                                    !fields.middleName?.trim() && (
                                        <span data-testid={DataTestId.Error1}>Provide a valid middle name</span>
                                    )
                                }
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="middleName"
                                $validation={(_, fields) => {
                                    const surname = fields.surname;
                                    const givenName = fields.givenName;
                                    return (
                                        (!surname?.trim() || !givenName?.trim()) && (
                                            <span data-testid={DataTestId.Error2}>
                                                Provide a valid given name and surname
                                            </span>
                                        )
                                    );
                                }}
                                data-testid={DataTestId.Middlename}
                                placeholder="Input a middle name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                $validation={(_, fields) =>
                                    !fields.givenName?.trim() && (
                                        <span data-testid={DataTestId.Error3}>Provide a valid given name</span>
                                    )
                                }
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
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
                        <Info>* The inputs are validated based on other fields</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
