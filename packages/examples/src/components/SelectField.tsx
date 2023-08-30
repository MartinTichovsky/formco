import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    select: string;
}

export const SelectField = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Select
                                $controller={controller}
                                $name="select"
                                $validation={(value) => !value && "Select an option"}
                                data-testid={DataTestId.Select}
                            >
                                <option></option>
                                <option>{TestingContent.CaptionOption1}</option>
                                <option>{TestingContent.CaptionOption2}</option>
                                <option value={TestingContent.ValueOption3}>{TestingContent.CaptionOption3}</option>
                            </FC.Select>
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
                        <Info>* Basic text field functionality, text fields must be not empty</Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
