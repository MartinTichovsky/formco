import { Condition, Controller, FC, FormController } from "formco";
import * as React from "react";
import { DataTestId } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    givenName: string;
    surname: string;
}

const DynamicComponent = ({ controller }: { controller: Controller<MyForm> }) => {
    return (
        <FieldRow data-testid={DataTestId.DynamicComponent}>
            Your surname is: {controller.getFieldValue("surname")}
        </FieldRow>
    );
};

const dynamicContent = (controller: Controller<MyForm>) => {
    return (
        <FieldRow data-testid={DataTestId.DynamicContent}>
            Your given name is: {controller.getFieldValue("givenName")}
        </FieldRow>
    );
};

export const GeneralConditionDynamic = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="givenName"
                                data-testid={DataTestId.GivenName}
                                placeholder="Input a given name"
                            />
                        </FieldRow>
                        <Condition controller={controller} dynamicContent={dynamicContent} />
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $name="surname"
                                data-testid={DataTestId.Surname}
                                placeholder="Input a surname"
                            />
                        </FieldRow>
                        <Condition controller={controller} dynamicRender>
                            <DynamicComponent controller={controller} />
                        </Condition>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * Text in conditions is filled based on typing in the inputs. Both condition are different.
                            The first condition is consuming a function and the second is consuming a react component.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
