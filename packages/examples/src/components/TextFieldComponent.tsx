import { FormController, Input, Submit } from "formco";
import React, { RefObject } from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

interface ClassComponentProps {
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void; // required
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // required
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // required
  placeholder: string;
  ref: React.RefObject<HTMLInputElement>;
}

interface FunctionalComponentProps {
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // required
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // required
  placeholder: string;
}

class ClassInputComponent extends React.Component<ClassComponentProps> {
  ref: RefObject<HTMLInputElement>;

  constructor(props: ClassComponentProps) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    const {
      defaultValue,
      disabled,
      labelText,
      onBlur,
      onChange,
      onKeyDown,
      placeholder,
      ...rest
    } = this.props;

    return (
      <>
        <label htmlFor="class-input" style={{ marginRight: 10 }}>
          {labelText}
        </label>
        <input
          {...rest}
          defaultValue={defaultValue}
          disabled={disabled}
          id="class-input"
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

const FunctionalInputComponent = React.forwardRef<
  HTMLInputElement,
  FunctionalComponentProps
>(
  (
    {
      defaultValue,
      disabled,
      labelText,
      onChange,
      onKeyDown,
      placeholder,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <label htmlFor="functional-input" style={{ marginRight: 10 }}>
          {labelText}
        </label>
        <input
          {...rest}
          defaultValue={defaultValue}
          disabled={disabled}
          id="functional-input"
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={ref}
        />
      </>
    );
  }
);

export const TextFieldComponent = (
  props: Partial<React.ComponentProps<typeof FormController>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm>
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row g-label-180">
              <Input
                controller={controller}
                data-testid="givenName"
                component={ClassInputComponent}
                labelText="Class component"
                name="givenName"
                placeholder="Input a given name"
                validation={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row g-label-180">
              <Input
                controller={controller}
                data-testid="surname"
                component={FunctionalInputComponent}
                labelText="Functional component"
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row buttons">
              <Submit
                controller={controller}
                data-testid="submit"
                onSubmit={(fields, controller) =>
                  store.onSubmit(fields, controller)
                }
              >
                Submit
              </Submit>
              <button
                data-testid="reset"
                onClick={() => {
                  controller.resetForm();
                  store.reset();
                }}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * The first text field is created with a class input component.
              The second text field is created with a functional input
              component.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
