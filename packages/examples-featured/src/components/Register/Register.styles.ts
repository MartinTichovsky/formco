import styled from "@emotion/styled";

export const invalidColor = "#ff0000";
export const validColor = "#05ff5e";

export const Colored = styled("div")({
    "input.field-invalid, select.field-invalid, textarea.field-invalid": {
        borderColor: invalidColor,
        outlineColor: "#c50303"
    },

    "input.field-valid, select.field-valid, textarea.field-valid": {
        borderColor: validColor,
        outlineColor: "#0ae056"
    },

    ".field-message, .field-message > span, .field-message > svg": {
        verticalAlign: "middle"
    },

    ".field-message-invalid": {
        color: invalidColor,
        fontSize: ".9em"
    },

    ".field-message-valid": {
        color: validColor,
        fontSize: ".9em"
    }
});
