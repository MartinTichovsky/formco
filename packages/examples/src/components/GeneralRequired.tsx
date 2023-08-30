import { CN, FC, FormController, Validation } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    description: string;
    checkbox1: boolean;
    checkbox2: boolean;
    givenName: string;
    radio: string;
    select: string;
    surname: string;
}

export const GeneralRequired = ({
    disableIfNotValid = true,
    disabledByDefault = true,
    validateOnChange = true,
    ...props
}: Partial<React.ComponentProps<typeof FormController>> & {
    disableIfNotValid?: boolean;
    disabledByDefault?: boolean;
}) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm>
                {...props}
                onSubmit={(fields) => console.log(fields)}
                validateOnChange={validateOnChange}
            >
                {(controller) => (
                    <>
                        <div className="g-label-120">
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.GivenName}
                                    $name="givenName"
                                    $required
                                    data-testid={DataTestId.GivenName}
                                    placeholder="Input a given name"
                                />
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.Surname}
                                    $name="surname"
                                    $requiredComponent={
                                        <span
                                            className={CN.RequiredStar}
                                            style={{
                                                color: "blue",
                                                marginLeft: 5
                                            }}
                                        >
                                            *
                                        </span>
                                    }
                                    $required
                                    $validation={(value) =>
                                        value!.trim().length < 4 && (
                                            <span style={{ color: "red" }}>Surname must have at least 4 letters</span>
                                        )
                                    }
                                    data-testid={DataTestId.Surname}
                                    placeholder="Input a surname"
                                />
                            </FieldRow>
                        </div>
                        <Validation
                            required
                            validation={(value) => !value && <span style={{ color: "red" }}>Select an option</span>}
                        >
                            <FieldRow data-testid={DataTestId.RadioFieldRow1}>
                                <FC.Input
                                    $controller={controller}
                                    $hideIf={(fields) => !fields.givenName?.trim()}
                                    $label={TestingContent.CaptionOption1}
                                    $name="radio"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption1}
                                    data-testid={DataTestId.Radio1}
                                />
                            </FieldRow>
                            <FieldRow data-testid={DataTestId.RadioFieldRow2}>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.CaptionOption2}
                                    $name="radio"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption2}
                                    data-testid={DataTestId.Radio2}
                                />
                            </FieldRow>
                            <FieldRow data-testid={DataTestId.RadioFieldRow3}>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.CaptionOption3}
                                    $name="radio"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption3}
                                    data-testid={DataTestId.Radio3}
                                />
                            </FieldRow>
                        </Validation>
                        <FieldRow className="g-label-120">
                            <FC.Select
                                $controller={controller}
                                $label="Select"
                                $name="select"
                                $required
                                $validation={(value) =>
                                    !value && <span style={{ color: "red" }}>Select an option</span>
                                }
                                data-testid={DataTestId.Select}
                            >
                                <option></option>
                                <option>{TestingContent.CaptionOption1}</option>
                                <option>{TestingContent.CaptionOption2}</option>
                                <option value={TestingContent.ValueOption3}>{TestingContent.CaptionOption3}</option>
                            </FC.Select>
                        </FieldRow>
                        <FieldRow>
                            <FC.Textarea
                                $controller={controller}
                                $name="description"
                                $required
                                data-testid={DataTestId.Textarea}
                                placeholder="Input a text"
                                style={{ width: 339 }}
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label="Required with message"
                                $name="checkbox1"
                                $required
                                $type="checkbox"
                                $validation={(value) =>
                                    !value && <span style={{ color: "red" }}>This checkbox must be checked</span>
                                }
                                data-testid={DataTestId.Checkbox1}
                            />
                        </FieldRow>
                        <FieldRow>
                            <FC.Input
                                $controller={controller}
                                $label="Required without message"
                                $name="checkbox2"
                                $required
                                $type="checkbox"
                                data-testid={DataTestId.Checkbox2}
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $disabledByDefault={disabledByDefault}
                                $disableIfNotValid={disableIfNotValid}
                                $onSubmit={(fields, controller) => store.onSubmit(fields, controller)}
                                data-testid={DataTestId.Submit}
                            >
                                Submit
                            </FC.Submit>
                            <ResetButton controller={controller} store={store} />
                        </FieldRowButtons>
                        <Info>
                            * All fields are required. The star is provided on first input with default way, the second
                            input is consuming the star as a element. The fields have red border, if they are not valid
                            and green if they are valid. Some fields show an error message if they are invalid. The
                            submit button is disabled until the form is not valid.
                        </Info>
                    </>
                )}
            </FormController>
        </Template>
    );
};
