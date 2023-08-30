import { Controller } from "../../controller";
import { FormFields, ValidationResult } from "../../private-controller.types";

export interface CustomFieldPrivateProps {
    onBlur: (event: React.ChangeEvent) => void;
    onChange: (event: React.ChangeEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

export interface CustomFieldPublicProps<T extends FormFields<T>, K extends keyof T> {
    $controller: Controller<T>;
    $disableIf?: (fields: Partial<T>) => boolean;
    $hideIf?: (fields: Partial<T>) => boolean;
    $id?: string;
    $initialValidation?: boolean;
    $name: K;
    $validateOnBlur?: boolean;
    $validateOnChange?: boolean;
}

export interface CustomFieldType<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & CustomFieldPrivateProps>
> {
    ({
        $component,
        $controller,
        $disableIf,
        $hideIf,
        $id,
        $initialValidation,
        $name,
        $onValidation,
        $provideValue,
        $validation,
        $validateOnBlur,
        $validateOnChange,
        children,
        ...rest
    }: React.PropsWithChildren<
        CustomFieldPublicProps<T, K> & {
            $component: IComponent;
            $onValidation?: (
                isFieldValid: boolean,
                setProps: React.Dispatch<React.SetStateAction<typeof rest>>,
                validationInProgress: boolean
            ) => void;
            $provideValue?: boolean;
            $validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
        } & Omit<React.ComponentPropsWithoutRef<IComponent>, "onBlur" | "onChange" | "onKeyDown">
    >): JSX.Element | null;
}

export interface CustomFieldComponentProps<T extends FormFields<T>, K extends keyof T> {
    controller: CustomFieldPublicProps<T, K>["$controller"];
    disableIf?: CustomFieldPublicProps<T, K>["$disableIf"];
    hideIf?: CustomFieldPublicProps<T, K>["$hideIf"];
    id?: CustomFieldPublicProps<T, K>["$id"];
    initialValidation?: CustomFieldPublicProps<T, K>["$initialValidation"];
    name: CustomFieldPublicProps<T, K>["$name"];
    rest: Object;
    validateOnBlur?: CustomFieldPublicProps<T, K>["$validateOnBlur"];
    validateOnChange?: CustomFieldPublicProps<T, K>["$validateOnChange"];
}

export type CustomFieldComponentType<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & CustomFieldPrivateProps>
> = CustomFieldComponentProps<T, K> & {
    component: IComponent;
    onValidation?: (
        isFieldValid: boolean,
        setProps: React.Dispatch<React.SetStateAction<any>>,
        validationInProgress: boolean
    ) => void;
    provideValue?: boolean;
    validation?: (value: T[K] | undefined, fields: Partial<T>) => ValidationResult;
};
