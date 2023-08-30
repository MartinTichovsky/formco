import { FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

interface ClassComponentProps {
    defaultValue: string; // required
    disabled: boolean; // required
    labelText: string;
    name: string;
    onBlur: (event: React.ChangeEvent) => void; // required
    onChange: (event: React.ChangeEvent) => void; // required
    onKeyDown: (event: React.KeyboardEvent) => void; // required
    placeholder: string;
    ref: React.RefObject<HTMLInputElement>;
}

interface FunctionalComponentProps {
    defaultValue: string; // required
    disabled: boolean; // required
    labelText: string;
    onBlur: (event: React.ChangeEvent) => void; // required
    onChange: (event: React.ChangeEvent) => void; // required
    onKeyDown: (event: React.KeyboardEvent) => void; // required
    placeholder: string;
}

class ClassInputComponent extends React.Component<ClassComponentProps> {
    ref: React.RefObject<HTMLInputElement>;

    constructor(props: ClassComponentProps) {
        super(props);
        this.ref = React.createRef();
    }

    render() {
        const { defaultValue, disabled, labelText, onBlur, onChange, onKeyDown, placeholder, ...rest } = this.props;

        return (
            <>
                <label htmlFor={DataTestId.ClassInput} style={{ marginRight: 10 }}>
                    {labelText}
                </label>
                <input
                    {...rest}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    id={DataTestId.ClassInput}
                    onBlur={onBlur}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    ref={this.ref}
                />
            </>
        );
    }
}

const FunctionalInputComponent = React.forwardRef<HTMLInputElement, FunctionalComponentProps>(
    ({ defaultValue, disabled, labelText, onBlur, onChange, onKeyDown, placeholder, ...rest }, ref) => {
        return (
            <>
                <label htmlFor={DataTestId.FunctionalInput} style={{ marginRight: 10 }}>
                    {labelText}
                </label>
                <input
                    {...rest}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    id={DataTestId.FunctionalInput}
                    onBlur={onBlur}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    ref={ref}
                />
            </>
        );
    }
);

export const TextFieldComponent = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow className="g-label-180">
                            <FC.Input
                                $controller={controller}
                                $component={ClassInputComponent}
                                $name="givenName"
                                $validation={(value) => !value?.trim() && "Provide a valid given name"}
                                data-testid={DataTestId.GivenName}
                                labelText="Class component"
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <FieldRow className="g-label-180">
                            <FC.Input
                                $controller={controller}
                                $component={FunctionalInputComponent}
                                $name="surname"
                                $validation={(value) => !value?.trim() && "Provide a valid surname"}
                                data-testid={DataTestId.Surname}
                                labelText="Functional component"
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
                        <Info>
                            * The first text field is created with a class input component. The second text field is
                            created with a functional input component.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
