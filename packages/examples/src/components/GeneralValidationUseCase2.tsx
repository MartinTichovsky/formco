import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    surname: string;
}

export const GeneralValidationUseCase2 = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm>
                validateOnChange
                validation={{
                    firstName: (value) =>
                        (value === undefined || (typeof value === "string" && !value.trim())) &&
                        "Provide a valid given name",
                    surname: (value) =>
                        (value === undefined || (typeof value === "string" && !value.trim())) &&
                        "Provide a valid surname"
                }}
                {...props}
                onSubmit={(fields) => console.log(fields)}
            >
                {(controller) => (
                    <>
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
                                $name="surname"
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
                        <Info>* Providing the validation from the form controller</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
