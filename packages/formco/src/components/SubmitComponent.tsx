import React from "react";
import { FormFields } from "../controller.types";
import { SubmitComponentType, SubmitPrivateProps } from "./Submit.types";

export const SubmitComponent = <
  T extends FormFields<T>,
  BComponent extends React.ComponentType<
    React.ComponentProps<BComponent> & SubmitPrivateProps<T>
  >
>({
  ButtonComponent,
  children,
  controller,
  disabledByDefault = false,
  disableIfNotValid = false,
  onSubmit,
  ...rest
}: React.ComponentProps<SubmitComponentType<T, BComponent>>) => {
  const [isDisabled, setDisabled] = React.useState(disabledByDefault === true);

  const ButtonElement = React.useCallback(
    (
      props: React.PropsWithChildren<
        React.ButtonHTMLAttributes<HTMLButtonElement>
      >
    ) =>
      ButtonComponent && typeof ButtonComponent === "function" ? (
        <ButtonComponent
          {...({
            ...rest,
            ...props
          } as React.ComponentProps<React.ElementType>)}
        />
      ) : (
        <button {...props} type="button">
          {props.children}
        </button>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ButtonComponent]
  );

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (rest.onClick) {
      rest.onClick(event);
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
