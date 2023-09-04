import { FC, FormController, Validation } from "formco";
import * as React from "react";
import { DataTestId, TestingContent } from "../enums";
import { LogStore } from "../store";
import { FieldRow, FieldRowButtons, Info, ResetButton, Template } from "./Template/Template";

interface MyForm {
    description: string;
    firstName: string;
    radio: string;
    select: string;
    surname: string;
}

const RequiredInvalidMessage = (props: { className: string }) => (
    <span {...props} style={{ color: "red", verticalAlign: "top" }}>
        This Field is required
    </span>
);

const RequiredValidMessage = (props: { className: string }) => (
    <span {...props} style={{ color: "green", fontSize: ".8em", verticalAlign: "top" }}>
        &#10003;
    </span>
);

export const invalidFieldClassName = "invalid-field";
export const invalidGlobalClassName = "invalid-global";
export const validFieldClassName = "valid-field";
export const validGlobalClassName = "valid-global";
export const validValidationClassName = "valid-validation";

export const GeneralRequiredCommonMessage = (
    props: Partial<React.ComponentProps<typeof FormController>> & {
        disableIfNotValid?: boolean;
        disabledByDefault?: boolean;
    }
) => {
    const store = new LogStore();

    return (
        <Template store={store}>
            <FormController<MyForm>
                validateOnChange={true}
                {...props}
                onSubmit={(fields) => console.log(fields)}
                requiredInvalidMessage={<RequiredInvalidMessage className={invalidGlobalClassName} />}
                requiredValidMessage={<RequiredValidMessage className="valid-global" />}
            >
                {(controller) => (
                    <>
                        <div className="g-label-120">
                            <FieldRow data-testid={DataTestId.InputFieldRow1}>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.FirstName}
                                    $name="firstName"
                                    $required
                                    data-testid={DataTestId.FirstName}
                                    placeholder="Input a given name"
                                />
                            </FieldRow>
                            <FieldRow data-testid={DataTestId.InputFieldRow2}>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.Surname}
                                    $name="surname"
                                    $required
                                    data-testid={DataTestId.Surname}
                                    placeholder="Input a surname"
                                />
                            </FieldRow>
                        </div>
                        <Validation
                            required
                            requiredInvalidMessage={<RequiredInvalidMessage className="invalid-validation" />}
                            requiredValidMessage={<RequiredValidMessage className="valid-validation" />}
                        >
                            <FieldRow data-testid={DataTestId.RadioFieldRow1}>
                                <FC.Input
                                    $controller={controller}
                                    $hideIf={(fields) => !fields.firstName?.value?.trim()}
                                    $label={TestingContent.CaptionOption1}
                                    $name="radio"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption1}
                                    data-testid={DataTestId.Radio1}
                                />
                            </FieldRow>
                            <FieldRow>
                                <FC.Input
                                    $controller={controller}
                                    $label={TestingContent.CaptionOption2}
                                    $name="radio"
                                    $type="radio"
                                    $value={TestingContent.CaptionOption2}
                                    data-testid={DataTestId.Radio2}
                                />
                            </FieldRow>
                            <FieldRow>
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
                        <FieldRow data-testid={DataTestId.SelectFieldRow} className="g-label-120">
                            <FC.Select
                                $controller={controller}
                                $label="Select"
                                $name="select"
                                $required
                                data-testid={DataTestId.Select}
                            >
                                <option></option>
                                <option>{TestingContent.CaptionOption1}</option>
                                <option>{TestingContent.CaptionOption2}</option>
                                <option value={TestingContent.ValueOption3}>{TestingContent.CaptionOption3}</option>
                            </FC.Select>
                        </FieldRow>
                        <FieldRow data-testid={DataTestId.TextareaFieldRow}>
                            <FC.Textarea
                                $controller={controller}
                                $name="description"
                                $required
                                $requiredInvalidMessage={<RequiredInvalidMessage className="invalid-field" />}
                                $requiredValidMessage={<RequiredValidMessage className="valid-field" />}
                                data-testid={DataTestId.Textarea}
                                placeholder="Input a text"
                                style={{ width: 339 }}
                            />
                        </FieldRow>

                        <FieldRowButtons>
                            <FC.Submit
                                $controller={controller}
                                $disabledByDefault={props.disabledByDefault || true}
                                $disableIfNotValid={props.disableIfNotValid || true}
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
