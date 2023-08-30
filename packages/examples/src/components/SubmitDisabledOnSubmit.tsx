import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, FieldRowFullWidth, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

export const SubmitDisabledOnSubmit = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRowFullWidth>
                            <FC.Submit
                                $controller={controller}
                                $disableIfNotValid
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.SubmitTop}
                            >
                                Submit
                            </FC.Submit>
                        </FieldRowFullWidth>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="givenName"
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
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
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.SubmitBottom}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * After click on a submit button, all submit buttons will be disabled if the text fields are
                            not valid
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
