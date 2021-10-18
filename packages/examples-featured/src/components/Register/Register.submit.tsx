import { Controller } from "formco";
import React from "react";
import { MessageStore } from "../../store";
import { registerFetch } from "./Register.api";
import { RegisterForm } from "./Register.types";

interface State {
  error?: boolean;
  pending: boolean;
  success?: boolean;
}

const Pending = () => {
  const [dots, setDots] = React.useState(3);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  setTimeout(() => {
    if (isMounted.current) {
      setDots(dots === 3 ? 1 : dots + 1);
    }
  }, 500);

  return <span data-testid="pending">pending{".".repeat(dots)}</span>;
};

export const SubmitComponent = ({
  children,
  disabled,
  onClick,
  store,
  ...rest
}: React.PropsWithChildren<{
  disabled: boolean;
  onClick: (event: React.MouseEvent) => Controller<RegisterForm>;
  store: MessageStore;
}>) => {
  const [state, setState] = React.useState<State>({ pending: false });
  const refState = React.useRef(state);
  refState.current = state;
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const controller = await onClick(event);

    if (!controller.isValid) {
      return;
    }

    setState({ pending: true });

    controller.disableFields(true);

    const response = await registerFetch(
      controller.fields.email || "",
      controller.fields.username || ""
    );

    if (!isMounted.current) {
      return;
    }

    if (response.ok) {
      controller.resetForm();
      store.setMessage("Successfully registered", 3000);
    } else {
      // in case that somebody have already registered the same email or username
      controller.disableFields(false);
      controller.validate(true);
      setState({ error: true, pending: false });
      // dismiss the error after 3s
      setTimeout(() => {
        if (refState.current.error) {
          setState((prevState) => ({ ...prevState, error: false }));
        }
      }, 3000);
    }
  };

  return (
    <>
      <button
        {...rest}
        disabled={disabled}
        onClick={handleClick}
        {...(state.pending
          ? { style: { textAlign: "left", paddingLeft: 25 } }
          : {})}
      >
        {state.pending ? <Pending /> : children}
      </button>
      {state.error && (
        <span className="field-message field-message-invalid">
          Register failed
        </span>
      )}
    </>
  );
};
