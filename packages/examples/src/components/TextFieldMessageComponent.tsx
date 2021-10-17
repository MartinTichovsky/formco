import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const FunctionalMessageComponent = ({
  children
}: React.PropsWithChildren<{}>) => {
  return (
    <span data-testid="functional-component" style={{ marginLeft: 10 }}>
      Functional component error:{" "}
      <span style={{ color: "blue" }}>{children}</span>
    </span>
  );
};

class ClassMessageComponent extends React.Component {
  render() {
    return (
      <span data-testid="class-component" style={{ marginLeft: 10 }}>
        Class component error:{" "}
        <span style={{ color: "red" }}>{this.props.children}</span>
      </span>
    );
  }
}

export const TextFieldMessageComponent = (
  props: Partial<React.ComponentProps<typeof FormController>>
) => {
  const store = new LogStore();

  return (
    <Template store={store}>
      <FormController<MyForm>
        validateOnChange
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="givenName"
                messageComponent={FunctionalMessageComponent}
                name="givenName"
                placeholder="Input a given name"
                validation={(value) =>
                  !value?.trim() && "Provide a valid given name"
                }
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="surname"
                messageComponent={ClassMessageComponent}
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row buttons">
              <Submit
                data-testid="submit"
                controller={controller}
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
              * The first text field is created with a functional error
              component (blue color on error). The second text field is created
              with a class error component (red color on error). Type an empty
              text to show an error.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
