import * as React from "react";
import { LogStore } from "../../store";
import { Log } from "./Log";

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

export const Template = ({ children, store }: React.PropsWithChildren<{ store: LogStore }>) => {
    const [counter, setCounter] = React.useState(0);

    return (
        <div>
            <div className="re-render">
                <button data-testid="re-render" type="button" onClick={() => setCounter(counter + 1)}>
                    Re-Render Form: {counter}
                </button>
            </div>
            {children}
            <Log store={store} />
        </div>
    );
};
