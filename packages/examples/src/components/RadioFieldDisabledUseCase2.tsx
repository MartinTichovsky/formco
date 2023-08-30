import { FC, FormController, Validation } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    radioVolume1: string;
    radioVolume2: string;
    radioVolume3: string;
}

export const RadioFieldDisabledUseCase2 = (props: Partial<React.ComponentProps<typeof FormController>>) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm> {...props} onSubmit={(fields) => console.log(fields)}>
                {(controller) => (
                    <>
                        <Validation
                            validation={(value) =>
                                value === undefined && <span style={{ color: "red" }}>Choose an option</span>
                            }
                        >
                            <FieldRow>
                                <b>Radio Volume 1</b>
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $disableIf={(fields) => fields.radioVolume3 !== TestingContent.CaptionOption31}
                                    $label={TestingContent.CaptionOption11}
                                    $name="radioVolume1"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption11}
                                    data-testid={DataTestId.Radio11}
                                />
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $disableIf={(fields) => fields.radioVolume3 !== TestingContent.CaptionOption32}
                                    $label={TestingContent.CaptionOption12}
                                    $name="radioVolume1"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption12}
                                    data-testid={DataTestId.Radio12}
                                />
                            </FieldRow>

                            <FieldRow>
                                <b>Radio Volume 2</b>
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.CaptionOption21}
                                    $name="radioVolume2"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption21}
                                    data-testid={DataTestId.Radio21}
                                />
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.CaptionOption22}
                                    $name="radioVolume2"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption22}
                                    data-testid={DataTestId.Radio22}
                                />
                            </FieldRow>

                            <FieldRow>
                                <b>Radio Volume 3</b>
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $disableIf={(fields) => fields.radioVolume2 !== TestingContent.CaptionOption21}
                                    $label={TestingContent.CaptionOption31}
                                    $name="radioVolume3"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption31}
                                    data-testid={DataTestId.Radio31}
                                />
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $disableIf={(fields) => fields.radioVolume2 !== TestingContent.CaptionOption22}
                                    $label={TestingContent.CaptionOption32}
                                    $name="radioVolume3"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption32}
                                    data-testid={DataTestId.Radio32}
                                />
                            </FieldRow>
                        </Validation>

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
                            * Options are enabled based on previous selection. The order must be Radio Volume 2 then
                            Radio Volume 3.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
