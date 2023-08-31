import { Controller } from "formco";
import * as React from "react";
import { LogStore, MessageStore } from "../../store";
import { registerFetch } from "./Register.api";
import { RegisterDataTestId } from "./Register.enums";
import { RegisterForm } from "./Register.types";

interface SubmitComponentState {
    error?: boolean;
    pending: boolean;
    success?: boolean;
}

interface SubmitComponentProps {
    disabled: boolean;
    onClick: (event: React.MouseEvent) => Promise<Controller<RegisterForm>>;
    logStore: LogStore;
    messageStore: MessageStore;
}

const maxDotsCountInPending = 3;

const Pending = () => {
    const [dotsCount, setDotsCount] = React.useState(maxDotsCountInPending);
    const isMounted = React.useRef(true);

    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);

    setTimeout(() => {
        if (isMounted.current) {
            setDotsCount(dotsCount === maxDotsCountInPending ? 1 : dotsCount + 1);
        }
    }, 500);

    return <span data-testid={RegisterDataTestId.Pending}>pending{".".repeat(dotsCount)}</span>;
};

export const SubmitComponent = ({
    children,
    disabled,
    onClick,
    logStore,
    messageStore,
    ...rest
}: React.PropsWithChildren<SubmitComponentProps>) => {
    const [state, setState] = React.useState<SubmitComponentState>({ pending: false });
    const stateRef = React.useRef(state);
    stateRef.current = state;

    const isMounted = React.useRef(true);

    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);

    const handleClick = React.useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
        const controller = await onClick(event);

        if (!controller.isValid) {
            return;
        }

        setState({ pending: true });

        controller.disableFields(true);

        const response = await registerFetch(controller.fields.email || "", controller.fields.username || "");

        if (!isMounted.current) {
            return;
        }

        if (response.ok) {
            controller.resetForm();
            logStore.reset();
            messageStore.setMessage("Successfully registered", 3000);
        } else {
            logStore.reset();
            // in case that somebody have already registered the same email or username
            // test it in another tab
            controller.disableFields(false);
            // force validate input fields
            controller.validate(true);
            // disable the pending
            setState({ error: true, pending: false });
            // dismiss the error after 3s
            setTimeout(() => {
                if (stateRef.current.error) {
                    setState((prevState) => ({ ...prevState, error: false }));
                }
            }, 3000);
        }
    }, []);

    return (
        <>
            <button
                {...rest}
                disabled={disabled}
                onClick={handleClick}
                {...(state.pending ? { style: { textAlign: "left", paddingLeft: 25 } } : {})}
            >
                {state.pending ? <Pending /> : children}
            </button>
            {state.error && <span className="field-message field-message-invalid">Register failed</span>}
        </>
    );
};
