import React from "react";
import { PrivateController } from "../private-controller";
import { FormFields } from "../private-controller.types";
import { selectContext, usePrivateController } from "../providers";
import {
  FormType,
  RegisterAfterAll,
  SelectOptionProps,
  SelectOptionState
} from "./SelectOption.types";

const afterAll = new Map<
  PrivateController<FormFields<FormType>>,
  { action: () => void; queueId: number }
>();

export const executeAfterAll = async <T extends FormFields<T>>(
  privateController: PrivateController<FormFields<FormType>>
) => {
  if (!afterAll.has(privateController)) {
    return;
  }

  const stack = afterAll.get(privateController)!;
  stack.queueId--;

  if (stack!.queueId === 0) {
    stack.action();
    afterAll.delete(privateController);
  }
};

export const registerAfterAll = ({
  id,
  isDisabled,
  isVisible,
  name,
  privateController,
  selectRef,
  value
}: RegisterAfterAll) => {
  let queueId = 1;

  if (afterAll.has(privateController)) {
    queueId = ++afterAll.get(privateController)!.queueId;
  }

  afterAll.set(privateController, {
    action: () => {
      let proceedValidation = true;

      if (selectRef && selectRef.current && selectRef.current.options) {
        proceedValidation =
          Array.prototype.filter.call(
            selectRef.current.options,
            (option) =>
              (option.value === value && !isDisabled && isVisible) ||
              (option.value !== value && option.value && !option.disabled)
          ).length > 0;
      }

      if (proceedValidation) {
        privateController.setFieldValue({
          id,
          key: name,
          silent: !privateController.canFieldBeValidated(name),
          value: selectRef.current!.value
        });
      } else {
        privateController.setFieldValue({
          id,
          isValid: true,
          key: name,
          value: selectRef.current!.value
        });
      }
    },
    queueId
  });
};

export const SelectOption = <T extends FormFields<T>>({
  children,
  controller,
  disableIf,
  hideIf,
  ...rest
}: SelectOptionProps<T>) => {
  const context = React.useContext(selectContext);
  if (!context || !context.name) {
    return null;
  }

  const privateController = usePrivateController<T>();
  const { id, name, selectRef } = context;
  const [state, setState] = React.useState<SelectOptionState>({
    isDisabled: disableIf !== undefined && disableIf(privateController.fields),
    isVisible: hideIf === undefined || !hideIf(privateController.fields)
  });
  const refState = React.useRef<SelectOptionState>();
  refState.current = state;

  const key = React.useRef(0);

  if (disableIf !== undefined || hideIf !== undefined) {
    React.useEffect(() => {
      const action = () => {
        const isDisabled =
          disableIf !== undefined && disableIf(privateController.fields);
        const isVisible =
          hideIf === undefined || !hideIf(privateController.fields);

        if (
          refState.current!.isDisabled !== isDisabled ||
          refState.current!.isVisible !== isVisible
        ) {
          registerAfterAll({
            id,
            isDisabled,
            isVisible,
            name,
            privateController: privateController as PrivateController<
              FormFields<unknown>
            >,
            selectRef,
            value: rest.value !== undefined ? rest.value : children
          });

          key.current++;
          setState({
            isDisabled,
            isVisible
          });
        }
      };

      privateController.subscribeOnChange(action);

      return () => {
        privateController.unsubscribeOnChange(action);
      };
    }, [controller, disableIf, hideIf, refState]);
  }

  React.useEffect(() => {
    executeAfterAll(
      privateController as PrivateController<FormFields<unknown>>
    );
  }, [state]);

  if (!state.isVisible) {
    return null;
  }

  return (
    <option {...rest} disabled={state.isDisabled} key={key.current}>
      {children}
    </option>
  );
};
