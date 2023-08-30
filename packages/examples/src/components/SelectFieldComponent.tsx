import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    select1: string;
    select2: string;
}

class ClassSelectComponent extends React.Component<{
    defaultValue: string; // required
    disabled: boolean; // required
    labelText: string;
    name: string;
    onBlur: (event: React.ChangeEvent) => void; // required
    onChange: (event: React.ChangeEvent) => void; // required
    onKeyDown: (event: React.KeyboardEvent) => void; // required
}> {
    render() {
        const { defaultValue, disabled, labelText, onBlur, onChange, onKeyDown, ...rest } = this.props;

        return (
            <span>
                <label htmlFor={DataTestId.ClassSelect} style={{ marginRight: 10 }}>
                    {labelText}
                </label>
                <select
                    {...rest}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    id={DataTestId.ClassSelect}
                    onBlur={onBlur}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                >
                    {this.props.children}
                </select>
            </span>
        );
    }
}

const FunctionalSelectComponent = React.forwardRef<
    HTMLSelectElement,
    React.PropsWithChildren<{
        defaultValue: string; // required
        disabled: boolean; // required
        labeltext: string;
        onBlur: (event: React.ChangeEvent) => void; // required
        onChange: (event: React.ChangeEvent) => void; // required
        onKeyDown: (event: React.KeyboardEvent) => void; // required
    }>
>(({ children, defaultValue, disabled, labeltext, onBlur, onChange, onKeyDown, ...rest }, ref) => (
    <span>
        <label htmlFor={DataTestId.FuntionalSelect} style={{ marginRight: 10 }}>
            {labeltext}
        </label>
        <select
            {...rest}
            defaultValue={defaultValue}
            disabled={disabled}
            ref={ref}
            id={DataTestId.FuntionalSelect}
            onBlur={onBlur}
            onChange={onChange}
            onKeyDown={onKeyDown}
        >
            {children}
        </select>
    </span>
));

export const SelectFieldComponent = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <div className="g-label-150">
                        <FieldRow>
                            <FC.Select
                                $component={ClassSelectComponent}
                                $controller={controller}
                                $name="select1"
                                $validation={(value) => !value && "Select an option"}
                                data-testid={DataTestId.Select1}
                                labelText="Class Select"
                            >
                                <option></option>
                                <option>{TestingContent.CaptionOption11}</option>
                                <option>{TestingContent.CaptionOption12}</option>
                                <option value={TestingContent.ValueOption13}>{TestingContent.CaptionOption13}</option>
                            </FC.Select>
                        </FieldRow>
                        <FieldRow>
                            <FC.Select
                                $component={FunctionalSelectComponent}
                                $controller={controller}
                                $name="select2"
                                $validation={(value) => !value && "Select an option"}
                                data-testid={DataTestId.Select2}
                                labeltext="Functional Select"
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
                            * The first select field is created with a class select component. The second select field
                            is created with a functional select component.
                        </Info>
                    </div>
                )}
            </FormController>
        </Template>
    );
};
