import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    surname: string;
}

export const GeneralValidateOnChange = (
    props: Partial<
        React.ComponentProps<typeof FormController> & {
            inputValidateOnChange: boolean;
        }
    >
) => {
    const store = new LogStore();
    const { inputValidateOnChange, ...rest } = props;

    return (
        <Template store={store}>
            <FormController<MyForm> validateOnChange {...rest} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="firstName"
                                $validateOnChange={inputValidateOnChange}
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.FirstName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                $validateOnChange={inputValidateOnChange}
                                $validation={(value) => !value?.trim() && "Provide a valid surname"}
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
                        <Info>* Validate on change, input an empty string to test it</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
