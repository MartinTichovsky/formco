import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    surname: string;
}

const initialValues: Partial<MyForm> = {
    firstName: TestingContent.James
};

export const TextFieldDefaultValuesUseCase2 = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm>
                initialValues={initialValues}
                {...props}
                options={{ setInitialValueOnDisable: true, ...props.options }}
                onSubmit={(fields) => console.log(fields)}
            >
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $disableIf={(fields) => !fields.surname?.value?.trim()}
                                $name="firstName"
                                $validation={(value) =>
                                    (value === undefined || !value.trim()) && "Provide a valid given name"
                                }
                                data-testid={DataTestId.FirstName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                $validation={(value) =>
                                    (value === undefined || !value.trim()) && "Provide a valid surname"
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
                        <Info>
                            * Give name is enabled after a valid value is typed in surname. When delete surname, the
                            given name should have initial value.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
