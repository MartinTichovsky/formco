import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    checkbox1: boolean;
    checkbox2: boolean;
    checkbox3: boolean;
}

export const CheckboxField = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label={TestingContent.CaptionCheckbox1}
                                $name="checkbox1"
                                $type="checkbox"
                                data-testid={DataTestId.Checkbox1}
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label={TestingContent.CaptionCheckbox2}
                                $name="checkbox2"
                                $type="checkbox"
                                $validation={(value) => value !== true && "This checkbox must be checked"}
                                data-testid={DataTestId.Checkbox2}
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label={TestingContent.CaptionCheckbox3}
                                $name="checkbox3"
                                $type="checkbox"
                                data-testid={DataTestId.Checkbox3}
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
                            * Basic checkbox field functionality, the second checkbox must be checked to make the form
                            valid
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
