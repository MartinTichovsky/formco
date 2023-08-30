import { observer } from "mobx-react-lite";
import * as React from "react";
import { LogStore } from "../../store";

export const Log = observer(function Log({ store }: { store: LogStore }) {
    return (
        <div className="console-log">
            <h3>Console log:</h3>
            <pre>{store.log}</pre>
        </div>
    );
});
