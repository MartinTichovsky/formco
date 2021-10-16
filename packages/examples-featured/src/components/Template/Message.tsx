import { observer } from "mobx-react-lite";
import React from "react";
import { MessageStore } from "../../store";

export const Message = observer(function Message({
  store,
  ...rest
}: {
  store: MessageStore;
} & React.HTMLProps<HTMLElement>) {
  if (!store.message) {
    return null;
  }

  return (
    <span className="message" {...rest}>
      {store.message}
    </span>
  );
});
