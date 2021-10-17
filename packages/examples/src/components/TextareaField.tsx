import { Controller, FormController, Submit, Textarea } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  description: string;
  radio: string;
  surname: string;
};

const TextareaMessage = ({
  children
}: React.PropsWithChildren<{ controller: Controller<MyForm> }>) => {
  return <div>{children}</div>;
};

export const TextareaField = (
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
              <Textarea
                controller={controller}
                data-testid="textarea"
                initialValidation
                messageComponent={TextareaMessage}
                name="description"
                placeholder="Input a text"
                validation={(value) => {
                  const maxLetters = 10;
                  const lettersRemains = maxLetters - (value?.length || 0);

                  return {
                    isValid: (value?.length || 0) > 0 && lettersRemains >= 0,
                    content:
                      !value?.length && controller.isSubmitted ? (
                        <span data-testid="error" style={{ color: "red" }}>
                          You must type at least 1 character
                        </span>
                      ) : lettersRemains >= 0 ? (
                        <span
                          data-testid="valid-text"
                          style={{ color: "green" }}
                        >{`You can write ${lettersRemains} more character${
                          lettersRemains === 1 ? "" : "s"
                        }`}</span>
                      ) : (
                        <span
                          data-testid="invalid-text"
                          style={{ color: "red" }}
                        >{`You have written ${Math.abs(
                          lettersRemains
                        )} more character${
                          Math.abs(lettersRemains) === 1 ? "" : "s"
                        } that is allowed`}</span>
                      )
                  };
                }}
                validateOnChange
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
              * Basic textarea field functionality, text fields must be not
              empty and have no more than 10 letters.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
