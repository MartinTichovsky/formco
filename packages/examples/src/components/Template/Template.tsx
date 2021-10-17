import React from "react";
import { LogStore } from "../../store";
import { Log } from "./Log";

export const Template = ({
  children,
  store
}: React.PropsWithChildren<{ store: LogStore }>) => {
  const [counter, setCounter] = React.useState(0);

  return (
    <div className="styled-form">
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
      <Log store={store} />
    </div>
  );
};
