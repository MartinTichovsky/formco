import React from "react";
import { FormFields } from "../controller.types";
import { SubmitComponentType, SubmitPrivateProps } from "./Submit.types";

export const SubmitComponent = <
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
>({
  component: Component,
  children,
  controller,
  disabledByDefault = false,
  disableIfNotValid = false,
  onClick,
  onSubmit,
  ...rest
}: React.PropsWithChildren<
  React.ComponentProps<SubmitComponentType<T, BComponent>>
>) => {
  const [isDisabled, setDisabled] = React.useState(disabledByDefault === true);

  const ButtonElement = React.useCallback(
    (
      props: React.PropsWithChildren<
        React.ButtonHTMLAttributes<HTMLButtonElement>
      >
    ) =>
      Component && typeof Component === "function" ? (
        React.createElement(Component, {
          ...rest,
          ...props
        } as React.ComponentProps<React.ElementType>)
      ) : (
        <button {...props} type="button">
          {props.children}
        </button>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Component]
  );

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    await controller.submit();

    if (onSubmit) {
      onSubmit(controller.fields, controller);
    }

    return controller;
  };

  React.useEffect(() => {
    if (disableIfNotValid) {
      const onChangeAction = (isValid: boolean) => {
        setDisabled((controller.isSubmitted || disabledByDefault) && !isValid);
      };

      controller.subscribeOnChange(onChangeAction);

      return () => {
        controller.unsubscribeOnChange(onChangeAction);
      };
    }
  }, [controller, disableIfNotValid, setDisabled]);

  React.useEffect(() => {
    const onDisableAction = (disable: boolean) => {
      setDisabled(disable);
    };

    controller.subscribeOnDisableButton(onDisableAction);

    return () => {
      controller.unsubscribeOnDisableButton(onDisableAction);
    };
  }, [controller, setDisabled]);

  return (
    <ButtonElement {...rest} disabled={isDisabled} onClick={handleClick}>
      {children}
    </ButtonElement>
  );
};
