import React, { Suspense, lazy } from "react";
import { FullPageMessage } from "../FullPageMessage.js";
import { AccessTimeIcon } from "../../Imports/Icons.js";

const Account = lazy(() => import("../../Pages/Account.js"));
export const AccountWrapper = () => (
    <Suspense fallback={
        <FullPageMessage
            Icon={AccessTimeIcon}
            message="Loading account..."
        />
    }
    >
        <Account />
    </Suspense>
);
