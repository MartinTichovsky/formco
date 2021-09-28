import styled from "@emotion/styled";

export const Content = styled("div")({
  height: "100%",
  left: 320,
  overflowY: "auto",
  position: "absolute",
  top: 0,
  width: "calc(100% - 320px)",

  "> div": {
    padding: 10,

    ".form-controller": {
      marginTop: 15,

      ".field-row": {
        marginTop: 15,

        ".field-message": {
          paddingLeft: 10
        },

        ".field-required-star": {
          color: "red",
          marginLeft: 5,
          verticalAlign: "top"
        }
      },

      ".info": {
        fontFamily: "Arial",
        fontSize: ".8em",
        fontWeight: "bolder",
        marginTop: 20,
        maxWidth: 300
      }
    }
  }
});

export const ContentWithColoredInputs = styled("div")({
  input: {
    borderStyle: "solid",
    borderWidth: 1
  },

  "input.field-invalid, select.field-invalid, textarea.field-invalid": {
    borderColor: "#ff0000",
    outlineColor: "#c50303"
  },

  "input.field-valid, select.field-valid, textarea.field-valid": {
    borderColor: "#05ff5e",
    outlineColor: "#0ae056"
  }
});

export const Menu = styled("div")({
  height: "100%",
  overflowY: "auto",
  position: "absolute",
  top: 0,
  width: 280,

  ul: {
    margin: 0,
    padding: 10,

    li: {
      listStyle: "none",

      "&.menu-item": {
        marginLeft: 10,
        marginTop: 5,

        a: {
          color: "blue",
          textDecoration: "none",

          "&.selected": {
            textDecoration: "underline"
          },

          "&:hover": {
            textDecoration: "underline"
          }
        }
      },

      "&.section": {
        marginBottom: 10,
        textTransform: "uppercase",

        "&:not(:first-of-type)": {
          marginTop: 15
        }
      }
    }
  }
});
