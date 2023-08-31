import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    salutation: string;
    surname: string;
}

export const GeneralLabel = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <div className="g-label-120">
                        <FieldRow>
                            <label htmlFor="salutation">{TestingContent.Salutation}</label>{" "}
                            <FC.Input
                                $controller={controller}
                                $id="salutation"
                                $name="salutation"
                                data-testid={DataTestId.Salutation}
                                placeholder="Input salutation"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label={TestingContent.FirstName}
                                $name="firstName"
                                data-testid={DataTestId.FirstName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $id="surname"
                                $label={
                                    <>
                                        <label htmlFor="surname">{TestingContent.Surname}</label>{" "}
                                    </>
                                }
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
                        <Info>* Three different ways how to provide a label</Info>
                    </div>
                )}
            </FormController>
        </Template>
    );
};
