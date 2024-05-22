import React, { Suspense, lazy } from "react";
import { FullPageMessage } from "../FullPageMessage.js";
import { AccessTimeIcon } from "../../Imports/Icons.js";

const ExhibitionPage = lazy(() => import("../../Pages/ExhibitionPage.js"));
export const ExhibitionPageWrapper = () => (
    <Suspense fallback={
        <FullPageMessage
            Icon={AccessTimeIcon}
            message="Loading exhibition viewer..."
        />
    }
    >
        <ExhibitionPage />
    </Suspense>
);
