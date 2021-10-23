import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { PrivateController } from "../../private-controller";
import {
  getControllerProviderContext,
  ValidationProvider
} from "../../providers";
import { getGeneratedValues } from "../../__tests__/utils/value-generator";
import { FormField } from "../FormField";
import {
  FormFieldInternalProps,
  FormFieldPrivateProps,
  FormFieldType,
  InitialState
} from "../FormField.types";

type Form = {
  input: string;
  name: string;
  radio: string;
};

let controller: Controller<Form>;
let privateController: PrivateController<Form>;
let passedValues: {
  disableIf?: Function;
  hideIf?: Function;
  initialState?: InitialState;
  validation?: Function;
} = {};

const testId = "test-id";

jest.mock("../FormFieldComponent", () => {
  const origin = jest.requireActual("../FormFieldComponent");

  return {
    FormFieldComponent: function (...args: any[]) {
      passedValues = args[0];
      return origin.FormFieldComponent(...args);
    }
  };
});

console.error = jest.fn();

const FieldContainer = <K extends keyof Form>(
  props: React.PropsWithChildren<
    React.ComponentProps<
      FormFieldType<
        Form,
        K,
        React.ComponentType<FormFieldPrivateProps>,
        React.ElementType,
        HTMLInputElement,
        React.InputHTMLAttributes<HTMLInputElement>
      >
    > &
      FormFieldInternalProps
  >
) => (
  <FormField<
    Form,
    K,
    React.ComponentType<FormFieldPrivateProps>,
    React.ElementType,
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
  >
    {...props}
  />
);

beforeEach(() => {
  passedValues = {};
  privateController = new PrivateController<Form>({ setController: jest.fn() });
  controller = new Controller(privateController);
});

describe("Field", () => {
  test("Default functionality", () => {
    const context = getControllerProviderContext<Form>();

    render(
      <context.Provider value={privateController}>
        <FieldContainer
          controller={controller}
          data-testid={testId}
          fieldType="input"
          name="input"
        />
      </context.Provider>
    );

    expect(screen.getByTestId(testId)).toBeTruthy();
  });

  test("Providing wrong disableIf should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");
    const context = getControllerProviderContext<Form>();

    values.forEach((value) => {
      expect(() => {
        render(
          <context.Provider value={privateController}>
            <FieldContainer
              controller={controller}
              disableIf={value}
              fieldType="input"
              name="input"
            />
          </context.Provider>
        );
      }).toThrowError();
    });
  });

  test("Providing wrong validationDependencies should throw an error", () => {
    const values = getGeneratedValues(false, "array", "undefined");
    const context = getControllerProviderContext<Form>();

    values.forEach((value) => {
      expect(() => {
        render(
          <context.Provider value={privateController}>
            <FieldContainer
              controller={controller}
              fieldType="input"
              name="input"
              validationDependencies={value}
            />
          </context.Provider>
        );
      }).toThrowError();
    });
  });

  test("Providing wrong name should throw an error", () => {
    const values = getGeneratedValues(false, "string");
    const context = getControllerProviderContext<Form>();

    values.forEach((value) => {
      expect(() => {
        render(
          <context.Provider value={privateController}>
            <FieldContainer
              controller={controller}
              fieldType="input"
              name={value}
            />
          </context.Provider>
        );
      }).toThrowError();
    });
  });

  test("Providing wrong onFormChange should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");
    const context = getControllerProviderContext<Form>();

    values.forEach((value) => {
      expect(() => {
        render(
          <context.Provider value={privateController}>
            <FieldContainer
              controller={controller}
              fieldType="input"
              name="input"
              onFormChange={value}
            />
          </context.Provider>
        );
      }).toThrowError();
    });
  });

  test("Providing wrong validate should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");
    const context = getControllerProviderContext<Form>();

    values.forEach((value) => {
      expect(() => {
        render(
          <context.Provider value={privateController}>
            <FieldContainer
              controller={controller}
              fieldType="input"
              name="input"
              validation={value}
            />
          </context.Provider>
        );
      }).toThrowError();
    });
  });

  describe("Name checking", () => {
    test("Providing different name or radios with same name should not log a warning", () => {
      console.warn = jest.fn();
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="name"
          />
          <FieldContainer
            controller={controller}
            fieldType="input"
            label="radio 1"
            name="radio"
            type="radio"
            value="radio-1"
          />
          <FieldContainer
            controller={controller}
            fieldType="input"
            label="radio 2"
            name="radio"
            type="radio"
            value="radio-2"
          />
        </context.Provider>
      );

      expect(console.warn).not.toBeCalled();
    });

    test("Providing same name should log a warning", () => {
      console.warn = jest.fn();
      const context = getControllerProviderContext<Form>();

      expect(console.warn).not.toBeCalled();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(console.warn).toBeCalled();
    });

    test("Providing same name should log a warning - test with radio", () => {
      console.warn = jest.fn();
      const context = getControllerProviderContext<Form>();

      expect(console.warn).not.toBeCalled();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
          <FieldContainer
            controller={controller}
            fieldType="input"
            label="radio 2"
            name="input"
            type="radio"
            value="radio-2"
          />
        </context.Provider>
      );

      expect(console.warn).toBeCalled();
    });
  });

  describe("disableIf", () => {
    const disableIfController = jest.fn();
    const disableIfPassed = jest.fn();
    const disableIfProvider = jest.fn();

    test("DisableIf should be passed", () => {
      privateController["_disableIf"] = { input: disableIfController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            disableIf={disableIfPassed}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.disableIf).toEqual(disableIfPassed);
    });

    test("Get disableIf from controller", () => {
      privateController["_disableIf"] = { input: disableIfController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.disableIf).toEqual(disableIfController);
    });

    test("Get disableIf from provider", () => {
      privateController["_disableIf"] = { input: disableIfController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <ValidationProvider disableIf={disableIfProvider}>
            <FieldContainer
              controller={controller}
              fieldType="input"
              name="input"
            />
          </ValidationProvider>
        </context.Provider>
      );

      expect(passedValues.disableIf).toEqual(disableIfProvider);
    });
  });

  describe("hideIf", () => {
    const hideIfController = jest.fn();
    const hideIfPassed = jest.fn();
    const hideIfProvider = jest.fn();

    test("HideIf should be passed", () => {
      privateController["_hideIf"] = { input: hideIfController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            hideIf={hideIfPassed}
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.hideIf).toEqual(hideIfPassed);
    });

    test("Get hideIf from controller", () => {
      privateController["_hideIf"] = { input: hideIfController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.hideIf).toEqual(hideIfController);
    });

    test("Get hideIf from provider", () => {
      privateController["_hideIf"] = { input: hideIfController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <ValidationProvider hideIf={hideIfProvider}>
            <FieldContainer
              controller={controller}
              fieldType="input"
              name="input"
            />
          </ValidationProvider>
        </context.Provider>
      );

      expect(passedValues.hideIf).toEqual(hideIfProvider);
    });
  });

  describe("validation", () => {
    const validationController = jest.fn();
    const validationPassed = jest.fn();
    const validationProvider = jest.fn();

    test("HideIf should be passed", () => {
      privateController["_validation"] = { input: validationController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
            validation={validationPassed}
          />
        </context.Provider>
      );

      expect(passedValues.validation).toEqual(validationPassed);
    });

    test("Get hideIf from controller", () => {
      privateController["_validation"] = { input: validationController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.validation).toEqual(validationController);
    });

    test("Get validation from provider", () => {
      privateController["_validation"] = { input: validationController };
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <ValidationProvider validation={validationProvider}>
            <FieldContainer
              controller={controller}
              fieldType="input"
              name="input"
            />
          </ValidationProvider>
        </context.Provider>
      );

      expect(passedValues.validation).toEqual(validationProvider);
    });
  });

  describe("initialState", () => {
    test("Default", () => {
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: undefined,
        isVisible: true
      });
    });

    test("IsDisabled", () => {
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            disableIf={() => true}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: true,
        isValid: undefined,
        isVisible: true
      });
    });

    test("IsValid - from validation", () => {
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
            validation={() => false}
          />
        </context.Provider>
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: undefined,
        isVisible: true,
        message: undefined
      });
    });

    test("IsValid - from controller", () => {
      privateController["_fields"].input = {
        isDisabled: false,
        isValid: false,
        isValidated: true,
        isVisible: true,
        validationContent: undefined,
        validationInProgress: false,
        validationToBeExecuted: false,
        value: undefined
      };

      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: undefined,
        isVisible: true
      });
    });

    test("IsVisible", () => {
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            hideIf={() => true}
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: undefined,
        isVisible: false
      });
    });
  });

  describe("initialValidation", () => {
    test("Default", () => {
      const context = getControllerProviderContext<Form>();

      render(
        <context.Provider value={privateController}>
          <FieldContainer
            controller={controller}
            initialValidation
            fieldType="input"
            name="input"
          />
        </context.Provider>
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: true,
        isVisible: true
      });
    });
  });
});
