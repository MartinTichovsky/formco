import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    salutation: string;
    surname: string;
}

export const TextFieldHiddenUseCase2 = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> validateOnChange {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $hideIf={(fields) => !fields.surname?.trim()}
                                $name="salutation"
                                data-testid={DataTestId.Salutation}
                                placeholder="Input salutation"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="firstName"
                                data-testid={DataTestId.FirstName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $hideIf={(fields) => !fields.firstName?.trim()}
                                $name="surname"
                                $validation={(value) => !value?.trim() && "Provide a valid surname"}
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $disableIfNotValid
                                $disabledByDefault
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * The form is valid because `Given Name` field doesn't have a validation. You can submit an
                            empty form. The surname is hidden until the given name is filled. After typing your given
                            name, you must fill your surname, otherwise is form invalid. Salutation is optional and it
                            is hidden until given name and surname are not filled.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
