import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Controller } from "../../controller";
import { ValidationProvider } from "../../providers";
import { getGeneratedValues } from "../../__tests__/utils/value-generator";
import { Field } from "../Field";
import {
  FieldInternalProps,
  FieldPrivateInputProps,
  FieldType,
  InitialState
} from "../Field.types";

type Form = {
  input: string;
  name: string;
  radio: string;
};

const testId = "test-id";
let controller: Controller<Form>;
let passedValues: {
  disableIf?: Function;
  hideIf?: Function;
  initialState?: InitialState;
  validation?: Function;
} = {};

jest.mock("../FieldComponent", () => {
  const origin = jest.requireActual("../FieldComponent");

  return {
    FieldComponent: function (...args: any[]) {
      passedValues = args[0];
      return origin.FieldComponent(...args);
    }
  };
});

console.error = jest.fn();

const FieldContainer = <K extends keyof Form>(
  props: React.PropsWithChildren<
    React.ComponentProps<
      FieldType<
        Form,
        K,
        React.ComponentType<FieldPrivateInputProps<HTMLInputElement>>,
        React.ElementType,
        HTMLInputElement,
        React.InputHTMLAttributes<HTMLInputElement>
      >
    > &
      FieldInternalProps
  >
) => (
  <Field<
    Form,
    K,
    React.ComponentType<FieldPrivateInputProps<HTMLInputElement>>,
    React.ElementType,
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
  >
    {...props}
  />
);

beforeEach(() => {
  passedValues = {};
  const setController = jest.fn();
  controller = new Controller<Form>({ setController });
});

describe("Field", () => {
  test("Default functionality", () => {
    render(
      <FieldContainer
        controller={controller}
        data-testid={testId}
        fieldType="input"
        name="input"
      />
    );

    expect(screen.getByTestId(testId)).toBeTruthy();
  });

  test("Providing wrong controller should throw an error", () => {
    const values = getGeneratedValues();

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer controller={value} fieldType="input" name="input" />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong disableIf should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer
            controller={controller}
            disableIf={value}
            fieldType="input"
            name="input"
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong validationDependencies should throw an error", () => {
    const values = getGeneratedValues(false, "array", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
            validationDependencies={value}
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong name should throw an error", () => {
    const values = getGeneratedValues(false, "string");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer
            controller={controller}
            fieldType="input"
            name={value}
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong onFormChange should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
            onFormChange={value}
          />
        );
      }).toThrowError();
    });
  });

  test("Providing wrong validate should throw an error", () => {
    const values = getGeneratedValues(false, "function", "undefined");

    values.forEach((value) => {
      expect(() => {
        render(
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
            validation={value}
          />
        );
      }).toThrowError();
    });
  });

  describe("Name checking", () => {
    test("Providing different name or radios with same name should not log a warning", () => {
      console.warn = jest.fn();

      render(
        <>
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
        </>
      );

      expect(console.warn).not.toBeCalled();
    });

    test("Providing same name should log a warning", () => {
      console.warn = jest.fn();

      expect(console.warn).not.toBeCalled();

      render(
        <>
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
        </>
      );

      expect(console.warn).toBeCalled();
    });

    test("Providing same name should log a warning - test with radio", () => {
      console.warn = jest.fn();

      expect(console.warn).not.toBeCalled();

      render(
        <>
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
        </>
      );

      expect(console.warn).toBeCalled();
    });
  });

  describe("disableIf", () => {
    const disableIfController = jest.fn();
    const disableIfPassed = jest.fn();
    const disableIfProvider = jest.fn();

    test("DisableIf should be passed", () => {
      controller["_disableIf"] = { input: disableIfController };

      render(
        <FieldContainer
          controller={controller}
          disableIf={disableIfPassed}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.disableIf).toEqual(disableIfPassed);
    });

    test("Get disableIf from controller", () => {
      controller["_disableIf"] = { input: disableIfController };

      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.disableIf).toEqual(disableIfController);
    });

    test("Get disableIf from provider", () => {
      controller["_disableIf"] = { input: disableIfController };

      render(
        <ValidationProvider disableIf={disableIfProvider}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </ValidationProvider>
      );

      expect(passedValues.disableIf).toEqual(disableIfProvider);
    });
  });

  describe("hideIf", () => {
    const hideIfController = jest.fn();
    const hideIfPassed = jest.fn();
    const hideIfProvider = jest.fn();

    test("HideIf should be passed", () => {
      controller["_hideIf"] = { input: hideIfController };

      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          hideIf={hideIfPassed}
          name="input"
        />
      );

      expect(passedValues.hideIf).toEqual(hideIfPassed);
    });

    test("Get hideIf from controller", () => {
      controller["_hideIf"] = { input: hideIfController };

      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.hideIf).toEqual(hideIfController);
    });

    test("Get hideIf from provider", () => {
      controller["_hideIf"] = { input: hideIfController };

      render(
        <ValidationProvider hideIf={hideIfProvider}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </ValidationProvider>
      );

      expect(passedValues.hideIf).toEqual(hideIfProvider);
    });
  });

  describe("validation", () => {
    const validationController = jest.fn();
    const validationPassed = jest.fn();
    const validationProvider = jest.fn();

    test("HideIf should be passed", () => {
      controller["_validation"] = { input: validationController };

      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          name="input"
          validation={validationPassed}
        />
      );

      expect(passedValues.validation).toEqual(validationPassed);
    });

    test("Get hideIf from controller", () => {
      controller["_validation"] = { input: validationController };

      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.validation).toEqual(validationController);
    });

    test("Get validation from provider", () => {
      controller["_validation"] = { input: validationController };

      render(
        <ValidationProvider validation={validationProvider}>
          <FieldContainer
            controller={controller}
            fieldType="input"
            name="input"
          />
        </ValidationProvider>
      );

      expect(passedValues.validation).toEqual(validationProvider);
    });
  });

  describe("initialState", () => {
    test("Default", () => {
      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: undefined,
        isVisible: true
      });
    });

    test("IsDisabled", () => {
      render(
        <FieldContainer
          controller={controller}
          disableIf={() => true}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: true,
        isValid: undefined,
        isVisible: true
      });
    });

    test("IsValid - from validation", () => {
      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          name="input"
          validation={() => false}
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: undefined,
        isVisible: true,
        message: undefined
      });
    });

    test("IsValid - from controller", () => {
      controller["_fields"].input = {
        isDisabled: false,
        isValid: false,
        isValidated: true,
        isVisible: true,
        validationContent: undefined,
        validationInProgress: false,
        value: undefined
      };

      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: undefined,
        isVisible: true
      });
    });

    test("IsVisible", () => {
      render(
        <FieldContainer
          controller={controller}
          fieldType="input"
          hideIf={() => true}
          name="input"
        />
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
      render(
        <FieldContainer
          controller={controller}
          initialValidation
          fieldType="input"
          name="input"
        />
      );

      expect(passedValues.initialState).toEqual({
        isDisabled: false,
        isValid: true,
        isVisible: true
      });
    });
  });
});
