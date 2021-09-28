import React from "react";

export const Template = ({ children }: React.PropsWithChildren<{}>) => {
  const [counter, setCounter] = React.useState(0);

  return (
    <div className="form">
      <div className="re-render">
        <button
          data-testid="re-render"
          type="button"
          onClick={() => setCounter(counter + 1)}
        >
          Re-Render Form: {counter}
        </button>
      </div>
      {children}
    </div>
  );
};
