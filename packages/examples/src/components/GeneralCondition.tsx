import { Condition, FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const formIsValidText = "Form is valid";
export const submitConditionText = "Submit button was clicked";

export const GeneralCondition = (
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
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="givenName"
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
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <Condition controller={controller} ifFormValid>
              <div className="field-row">{formIsValidText}</div>
            </Condition>
            <Condition
              controller={controller}
              showIf={() => controller.isSubmitted}
            >
              <div className="field-row">{submitConditionText}</div>
            </Condition>
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
              * Text `Form is valid` will be shown after all text inputs are
              valid. Text `Submit button was clicked` will be shown after click
              on the submit button.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
