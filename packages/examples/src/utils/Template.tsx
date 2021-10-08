import React from "react";
import { Log } from "./Log";
import { LogStore } from "./store";

export const Template = ({
  children,
  store
}: React.PropsWithChildren<{ store: LogStore }>) => {
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
      <Log store={store} />
    </div>
  );
};
