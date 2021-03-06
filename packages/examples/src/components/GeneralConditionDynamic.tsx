import { Condition, Controller, FormController, Input, Submit } from "formco";
import React from "react";
import { LogStore } from "../store";
import { Template } from "./Template/Template";

type MyForm = {
  givenName: string;
  surname: string;
};

const dynamicContent = (controller: Controller<MyForm>) => {
  return (
    <div className="field-row" data-testid="dynamic-content">
      Your given name is: {controller.getFieldValue("givenName")}
    </div>
  );
};

const DynamicContext = ({ controller }: { controller: Controller<MyForm> }) => {
  return (
    <div className="field-row" data-testid="dynamic-context">
      Your surname is: {controller.getFieldValue("surname")}
    </div>
  );
};

export const GeneralConditionDynamic = (
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
              />
            </div>
            <Condition
              controller={controller}
              dynamicContent={dynamicContent}
            />
            <div className="field-row">
              <Input
                controller={controller}
                data-testid="surname"
                name="surname"
                placeholder="Input a surname"
              />
            </div>
            <Condition controller={controller} dynamicRender>
              <DynamicContext controller={controller} />
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
              * Text in conditions is filled based on typing in the inputs. Both
              condition are different. The first condition is consuming a
              function and the second is consuming a react component.
            </div>
          </>
        )}
      </FormController>
    </Template>
  );
};
