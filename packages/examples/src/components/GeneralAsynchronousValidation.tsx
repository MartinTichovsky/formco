import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { wait } from "../utils/utils";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  radio: string;
  surname: string;
};

export const GeneralAsynchronousValidation = (
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
                name="givenName"
                placeholder="Input a given name"
                validation={(value) => ({
                  content: "pending...",
                  promise: async function () {
                    await wait(2000);
                    return {
                      isValid: !!value?.trim(),
                      content: !value?.trim() ? (
                        <span style={{ color: "red" }}>
                          Provide a valid given name
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>
                          Given name is valid
                        </span>
                      )
                    };
                  }
                })}
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="surname"
                name="surname"
                placeholder="Input a surname"
                validation={(value) => ({
                  content: "pending...",
                  promise: async function () {
                    await wait(2000);
                    return {
                      isValid: !!value?.trim(),
                      content: !value?.trim() ? (
                        <span style={{ color: "red" }}>
                          Provide a valid surname
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>Surname is valid</span>
                      )
                    };
                  }
                })}
              />
            </div>
            <div className="field-row buttons">
              <Submit
                controller={controller}
                data-testid="submit"
                onClick={() => store.submitted()}
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
              * The both input fields are validated using asynchronous action.
              This simulate calling API for a validation. After input a value
              the promise action is called. Input an empty text to show invalid
              result message, pending is set to 2s. When click on the submit
              button during the pending, the submit button is disabled until all
              pending actions are done. The pending text can be also replaced
              with HTML element, such as a loading icon.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
