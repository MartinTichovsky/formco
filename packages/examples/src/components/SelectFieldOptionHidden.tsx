import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    select1: string;
    select2: string;
}

export const SelectFieldOptionHidden = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <div className="g-label-80">
                        <FieldRow>
                            <FC.Select
                                $controller={controller}
                                $label={TestingContent.Select1}
                                $name="select1"
                                $validation={(value) => !value && "Select an option"}
                                data-testid={DataTestId.Select1}
                            >
                                <option></option>
                                <FC.SelectOption
                                    $controller={controller}
                                    $hideIf={(fields) => fields.select2?.value !== TestingContent.CaptionOption21}
                                >
                                    {TestingContent.CaptionOption11}
                                </FC.SelectOption>
                                <FC.SelectOption
                                    $controller={controller}
                                    $hideIf={(fields) => fields.select2?.value !== TestingContent.CaptionOption22}
                                >
                                    {TestingContent.CaptionOption12}
                                </FC.SelectOption>
                                <FC.SelectOption
                                    $controller={controller}
                                    $hideIf={(fields) => fields.select2?.value !== TestingContent.ValueOption23}
                                    value={TestingContent.ValueOption13}
                                >
                                    {TestingContent.CaptionOption13}
                                </FC.SelectOption>
                            </FC.Select>
                        </FieldRow>
                        <FieldRow>
                            <FC.Select
                                $controller={controller}
                                $label={TestingContent.Select2}
                                $name="select2"
                                $validation={(value) => !value && "Select an option"}
                                data-testid={DataTestId.Select2}
                            >
                                <option></option>
                                <option>{TestingContent.CaptionOption21}</option>
                                <option>{TestingContent.CaptionOption22}</option>
                                <option value={TestingContent.ValueOption23}>{TestingContent.CaptionOption23}</option>
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
                        <Info>
                            * Options in select 1 are shown based on selection in select 2. When all options are hidden,
                            no validation is fired.
                        </Info>
                    </div>
                )}
            </FormController>
        </Template>
    );
};
