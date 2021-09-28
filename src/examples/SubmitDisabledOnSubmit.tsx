import React from "react";
import { FormControllerComponentProps } from "../components/FormController/types";
import { FormController, Input, Submit } from "../index";
import { Template } from "./utils/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

export const SubmitDisabledOnSubmit = (
  props: Partial<FormControllerComponentProps<MyForm>>
) => {
  return (
    <Template>
      <FormController<MyForm>
        {...props}
        onSubmit={(fields) => console.log(fields)}
      >
        {(controller) => (
          <>
            <div className="field-row">
              <Submit
                controller={controller}
                data-testid="submit-top"
                disableIfNotValid
              >
                Top Submit
              </Submit>
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="input-1"
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
                data-testid="input-2"
                name="surname"
                placeholder="Input a surname"
                validation={(value) =>
                  !value?.trim() && "Provide a valid surname"
                }
              />
            </div>
            <div className="field-row">
              <Submit
                controller={controller}
                data-testid="submit-bottom"
                disableIfNotValid
              >
                Bottom Submit
              </Submit>{" "}
              <button
                data-testid="reset"
                onClick={() => controller.resetForm()}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="info">
              * After click on a submit button, all submit buttons will be
              disabled if the text fields are not valid
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
