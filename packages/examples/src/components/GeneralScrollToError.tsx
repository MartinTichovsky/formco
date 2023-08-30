import { FC, FormController, Validation } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    checkbox: boolean;
    givenName: string;
    select: string;
    surname: string;
    note: string;
    radio: string;
}

export const GeneralScrollToError = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm>
                data-testid="form-controller"
                options={{ scrollToError: true }}
                {...props}
                onSubmit={(fields) => {
                    console.log(fields);
                }}
            >
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="givenName"
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow style={{ marginTop: 100 }}>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                $validation={(value) => !value?.trim() && "Provide a valid surname"}
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>
                        <FieldRow style={{ marginTop: 100 }}>
                            <FC.Textarea
                                $controller={controller}
                                $name="note"
                                $validation={(value) => !value?.trim() && "Provide a note"}
                                data-testid={DataTestId.Note}
                                placeholder="Input a note"
                            />
                        </FieldRow>
                        <FieldRow style={{ marginTop: 100 }}>
                            <FC.Select
                                $controller={controller}
                                $name="select"
                                $validation={(value) => !value && "Select an option"}
                                data-testid={DataTestId.Select}
                            >
                                <option></option>
                                <option>{TestingContent.CaptionOption1}</option>
                                <option>{TestingContent.CaptionOption2}</option>
                                <option>{TestingContent.CaptionOption3}</option>
                            </FC.Select>
                        </FieldRow>
                        <Validation validation={(value) => value === undefined && "Choose an option"}>
                            <FieldRow style={{ marginTop: 100 }}>
                                <FC.Input
                                    $controller={controller}
                                    $hideIf={(fields) => fields.surname === TestingContent.Bond}
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
                        <FieldRow style={{ marginTop: 100 }}>
                            <FC.Input
                                $controller={controller}
                                $label={TestingContent.CaptionCheckbox}
                                $name="checkbox"
                                $type="checkbox"
                                $validation={(value) => value !== true && "This checkbox must be checked"}
                                data-testid={DataTestId.Checkbox1}
                            />
                        </FieldRow>

                        <FieldRowButtons style={{ marginTop: 400 }}>
                            <FC.Submit
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>* Basic text field functionality, text fields must be not empty</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
