import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "./utils/store";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const GeneralValidateOnBlur = (
  props: Partial<
    React.ComponentProps<typeof FormController> & {
      inputValidateOnBlur: boolean;
    }
  >
) => {
  const store = new LogStore();
  const { inputValidateOnBlur, ...rest } = props;
  return (
    <Template store={store}>
      <FormController<MyForm>
        validateOnBlur
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
                validateOnBlur={inputValidateOnBlur}
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
                validateOnBlur={inputValidateOnBlur}
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
            <div className="info">*</div>
          </>
        )}
      </FormController>
    </Template>
  );
};
