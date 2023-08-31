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

export const List = ({ list }: { list: { [key: string]: string[] } }) => {
    const keys = Object.keys(list);

    return (
        <>
            {keys.map((key) => (
                <div className="info-list" key={key}>
                    <div className="info-list-key">{key}</div>
                    <div className="info-list-items">
                        {list[key].map((item, index) => (
                            <p key={index}>{`- ${item}`}</p>
                        ))}
                    </div>
                </div>
            ))}
        </>
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
