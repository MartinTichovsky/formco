import React from "react";
import { Controller } from "../controller";
import { ConditionComponentType } from "./Condition.types";
import { ConditionComponent } from "./ConditionComponent";

export const Condition: ConditionComponentType = (props) => {
  if (!(props.controller instanceof Controller)) {
    throw new Error("Controller is not provided");
  }

  if (props.showIf !== undefined && typeof props.showIf !== "function") {
    throw new Error("CustomCondition is not a function");
  }

  if (
    props.dynamicContent !== undefined &&
    typeof props.dynamicContent !== "function"
  ) {
    throw new Error("DynamicContent is not a function");
  }

  return <ConditionComponent {...props} />;
};
