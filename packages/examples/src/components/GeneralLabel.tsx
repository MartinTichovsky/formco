import { FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  salutation: string;
  surname: string;
};

export const GeneralLabel = (
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
          <div className="g-label-120">
            <div className="field-row">
              <label htmlFor="salutation">Salutation</label>{" "}
              <Input
                controller={controller}
                data-testid="salutation"
                id="salutation"
                name="salutation"
                placeholder="Input salutation"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="givenName"
                label="Given name"
                name="givenName"
                placeholder="Input a given name"
              />
            </div>
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="surname"
                id="surname"
                label={
                  <>
                    <label htmlFor="surname">Surname</label>{" "}
                  </>
                }
                name="surname"
                placeholder="Input a surname"
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
              * Three different ways how to provide a label
            </div>
          </div>
        )}
      </FormController>
    </Template>
  );
};
