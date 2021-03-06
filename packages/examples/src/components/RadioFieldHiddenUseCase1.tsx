import { FormController, Input, Submit, Validation } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  radioVolume1: string;
  radioVolume2: string;
  radioVolume3: string;
};

export const RadioFieldHiddenUseCase1 = (
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
            <Validation
              validation={(value) =>
                value === undefined && (
                  <span style={{ color: "red" }}>Choose an option</span>
                )
              }
            >
              <Validation<MyForm> hideIf={(fields) => !fields.radioVolume3}>
                <div className="field-row">
                  <b>Radio Volume 1</b>
                </div>
                <div className="field-row">
                  <Input
                    controller={controller}
                    data-testid="radio-1-1"
                    label="Option 1-1"
                    name="radioVolume1"
                    type="radio"
                    value="Option 1-1"
                  />
                </div>
                <div className="field-row">
                  <Input
                    controller={controller}
                    data-testid="radio-1-2"
                    label="Option 1-2"
                    name="radioVolume1"
                    type="radio"
                    value="Option 1-2"
                  />
                </div>
              </Validation>

              <div className="field-row">
                <b>Radio Volume 2</b>
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-2-1"
                  label="Option 2-1"
                  name="radioVolume2"
                  type="radio"
                  value="Option 2-1"
                />
              </div>
              <div className="field-row">
                <Input
                  controller={controller}
                  data-testid="radio-2-2"
                  label="Option 2-2"
                  name="radioVolume2"
                  type="radio"
                  value="Option 2-2"
                />
              </div>

              <Validation<MyForm> hideIf={(fields) => !fields.radioVolume2}>
                <div className="field-row">
                  <b>Radio Volume 3</b>
                </div>
                <div className="field-row">
                  <Input
                    controller={controller}
                    data-testid="radio-3-1"
                    label="Option 3-1"
                    name="radioVolume3"
                    type="radio"
                    value="Option 3-1"
                  />
                </div>
                <div className="field-row">
                  <Input
                    controller={controller}
                    data-testid="radio-3-2"
                    label="Option 3-2"
                    name="radioVolume3"
                    type="radio"
                    value="Option 3-2"
                  />
                </div>
              </Validation>
            </Validation>
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
              * Radio Volume 1 is hidden until Radio Volume 3 is not valid.
              Radio Volume 3 is hidden until Radio Volume 2 is not valid.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
