import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const GeneralValidateOnChange = (
  props: Partial<
    React.ComponentProps<typeof FormController> & {
      inputValidateOnChange: boolean;
    }
  >
) => {
  const store = new LogStore();
  const { inputValidateOnChange, ...rest } = props;

  return (
    <Template store={store}>
      <FormController<MyForm>
        validateOnChange
        {...rest}
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
                validateOnChange={inputValidateOnChange}
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
                validateOnChange={inputValidateOnChange}
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
              * Validate on change, input an empty string to test it
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
