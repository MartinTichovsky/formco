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

export const CheckboxFieldHidden = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm>
                initialValues={{
                    checkbox2: true
                }}
                {...props}
                onSubmit={(fields) => console.log(fields)}
            >
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
                                $hideIf={(fields) => !fields.checkbox1}
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
                            * The second checkbox is disabled until the first checkbox is not checked. The second
                            checkbox must be checked to submit the form. When the first checkbox is checked, the second
                            checkbox unchecked and then the first checkbox unchecked, the second checkbox should be
                            disabled and checked because of the value is taken from default values.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
