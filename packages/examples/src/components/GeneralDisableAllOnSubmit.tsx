import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    firstName: string;
    surname: string;
    radio: string;
}

export const GeneralDisableAllOnSubmit = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={() => {}}>
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
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label={TestingContent.CaptionOption1}
                                $name="radio"
                                $type="radio"
                                $value={TestingContent.CaptionOption1}
                                data-testid={DataTestId.Radio1}
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label={TestingContent.CaptionOption2}
                                $name="radio"
                                $type="radio"
                                $value={TestingContent.CaptionOption2}
                                data-testid={DataTestId.Radio2}
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $disableIfNotValid
                                $onSubmit={(fields, controller) => {
                                    console.log(fields);
                                    controller.disableFields(true);
                                    store.onSubmit(fields, controller);
                                }}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * When the form is submitted, all inputs will be disabled. Reset the form to enable them
                            again. No validation is provided.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
