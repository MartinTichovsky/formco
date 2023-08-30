import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

export const GeneralValidateOnBlur = (
    props: Partial<
        React.ComponentProps<typeof FormController> & {
            inputValidateOnBlur: boolean;
        }
    >
) => {
    const store = new LogStore();
    const { inputValidateOnBlur, ...rest } = props;
    return (
        <Template store={store}>
            <FormController<MyForm> validateOnBlur {...rest} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="givenName"
                                $validateOnBlur={inputValidateOnBlur}
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                $validateOnBlur={inputValidateOnBlur}
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
                        <Info>*</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
