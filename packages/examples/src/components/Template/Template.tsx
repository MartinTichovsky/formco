import { Controller, FormFields } from "formco";
import * as React from "react";
import { DataTestId } from "../../enums";
import { LogStore } from "../../store";
import { Log } from "./Log";

export const Template = ({ children, store }: React.PropsWithChildren<{ store: LogStore }>) => {
    const [counter, setCounter] = React.useState(0);

    return (
        <div className="styled-form">
            <div className="re-render">
                <button data-testid={DataTestId.ReRender} type="button" onClick={() => setCounter(counter + 1)}>
                    Re-Render Form: {counter}
                </button>
            </div>
            {children}
            <Log store={store} />
        </div>
    );
};

export const FieldRow = ({
    children,
    className,
    ...rest
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
    return (
        <div className={`field-row${className ? ` ${className}` : ""}`} {...rest}>
            {children}
        </div>
    );
};

export const FieldRowFullWidth = ({
    children,
    className,
    ...rest
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
    return (
        <FieldRow className={`full-width${className ? ` ${className}` : ""}`} {...rest}>
            {children}
        </FieldRow>
    );
};

export const FieldRowButtons = ({
    children,
    ...rest
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
    return (
        <div className="field-row buttons" {...rest}>
            {children}
        </div>
    );
};

export const Info = ({ children }: React.PropsWithChildren<{}>) => {
    return <div className="info">{children}</div>;
};

export const ResetButton = <T extends FormFields<T>>({
    controller,
    store
}: {
    controller: Controller<T>;
    store: LogStore;
}) => {
    return (
        <button
            data-testid={DataTestId.Reset}
            onClick={() => {
                controller.resetForm();
                store.reset();
            }}
            type="button"
        >
            Reset
        </button>
    );
};
