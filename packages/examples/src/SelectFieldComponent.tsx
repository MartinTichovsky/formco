import { FormController, Select, Submit } from "formco";
import React from "react";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  select1: string;
  select2: string;
};

class ClassSelectComponent extends React.Component<{
  defaultValue: string; // required
  disabled: boolean; // required
  labelText: string;
  onBlur: (event: React.ChangeEvent<HTMLSelectElement>) => void; // required
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // required
}> {
  render() {
    const { defaultValue, disabled, labelText, onBlur, onChange, ...rest } =
      this.props;

    return (
      <span>
        <label htmlFor="class-select" style={{ marginRight: 10 }}>
          {labelText}
        </label>
        <select
          {...rest}
          defaultValue={defaultValue}
          disabled={disabled}
          id="class-select"
          onBlur={onBlur}
          onChange={onChange}
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
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // required
  }>
>(({ children, defaultValue, disabled, labeltext, onChange, ...rest }, ref) => (
  <span>
    <label htmlFor="functional-select" style={{ marginRight: 10 }}>
      {labeltext}
    </label>
    <select
      {...rest}
      defaultValue={defaultValue}
      disabled={disabled}
      ref={ref}
      id="functional-select"
      onChange={onChange}
    >
      {children}
    </select>
  </span>
));

export const SelectFieldComponent = (
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
          <div className="g-label-150">
            <div className="field-row">
              <Select
                Component={ClassSelectComponent}
                controller={controller}
                data-testid="select-1"
                labelText="Class Select"
                name="select1"
                validation={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 1-1</option>
                <option>Option 1-2</option>
                <option value="option-1-3">Option 1-3</option>
              </Select>
            </div>
            <div className="field-row">
              <Select
                Component={FunctionalSelectComponent}
                controller={controller}
                data-testid="select-2"
                labeltext="Functional Select"
                name="select2"
                validation={(value) => !value && "Select an option"}
              >
                <option></option>
                <option>Option 2-1</option>
                <option>Option 2-2</option>
                <option value="option-2-3">Option 2-3</option>
              </Select>
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
              * The first select field is created with a class select component.
              The second select field is created with a functional select
              component.
            </div>
          </div>
        )}
      </FormController>
    </Template>
  );
};
