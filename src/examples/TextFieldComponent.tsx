import React from "react";
import { FormController, Input, Submit } from "../";
import { FormControllerComponentProps } from "../components/FormController.types";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

class ClassInputComponent extends React.Component<{
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // required
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // required
  placeholder: string;
}> {
  render() {
    const {
      defaultValue,
      disabled,
      labelText,
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
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
      </>
    );
  }
}

const FunctionalInputComponent = ({
  defaultValue,
  disabled,
  labelText,
  onChange,
  onKeyDown,
  placeholder,
  ...rest
}: {
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // required
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // required
  placeholder: string;
}) => {
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
      />
    </>
  );
};

export const TextFieldComponent = (
  props: Partial<FormControllerComponentProps<MyForm>>
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
                Component={ClassInputComponent}
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
                Component={FunctionalInputComponent}
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
