import * as React from "react";
import { FormFields } from "../../private-controller.types";
import { FormField } from "../FormField";
import { FormFieldPrivateProps, FormFieldType } from "../FormField.types";

export function Select<
    T extends FormFields<T>,
    K extends keyof T,
    IComponent extends React.ComponentType<React.ComponentProps<IComponent> & FormFieldPrivateProps>,
    MComponent extends React.ElementType
>(
    props: React.PropsWithChildren<
        FormFieldType<T, K, IComponent, MComponent, HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>
    >
) {
    return (
        <FormField<T, K, IComponent, MComponent, HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>
            {...props}
            fieldType="select"
        />
    );
}
