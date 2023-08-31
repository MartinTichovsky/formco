import * as React from "react";
import { FormController } from "..";
import { Input, Submit } from "../components/fields";

type MyForm = {
    firstName: string;
    surname: string;
};

export const InvalidFormUseCase1 = () => (
    <FormController<MyForm>>
        {(controller) => (
            <>
                <div>
                    <Input $controller={controller} $name="firstName" placeholder="Input a given name" />
                </div>
                <div>
                    <Input $controller={controller} $name="firstName" placeholder="Input a surname" />
                </div>
                <div>
                    <Submit $controller={controller}>Submit</Submit>
                    <button data-testid="reset" onClick={() => controller.resetForm()} type="button">
                        Reset
                    </button>
                </div>
            </>
        )}
    </FormController>
);
