import React from "react";
import { FormController, Input, Submit } from "..";

type MyForm = {
  givenName: string;
  surname: string;
};

export const InvalidFormUseCase1 = () => (
  <FormController<MyForm>>
    {(controller) => (
      <>
        <div>
          <Input
            controller={controller}
            name="givenName"
            placeholder="Input a given name"
          />
        </div>
        <div>
          <Input
            controller={controller}
            name="givenName"
            placeholder="Input a surname"
          />
        </div>
        <div>
          <Submit controller={controller}>Submit</Submit>
          <button
            data-testid="reset"
            onClick={() => controller.resetForm()}
            type="button"
          >
            Reset
          </button>
        </div>
      </>
    )}
  </FormController>
);
