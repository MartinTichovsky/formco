import { FC, FormController, Validation } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    radio: string;
}

export const RadioField = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <Validation
                            validation={(value) =>
                                value === undefined && <span style={{ color: "red" }}>Choose an option</span>
                            }
                        >
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
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.CaptionOption3}
                                    $name="radio"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption3}
                                    data-testid={DataTestId.Radio3}
                                />
                            </FieldRow>
                        </Validation>

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
                        <Info>* Basic radio field functionality, one option must be selected</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
