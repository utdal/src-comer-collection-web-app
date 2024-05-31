/* eslint-disable react/no-multi-comp */
import { RouterProvider } from "react-router-dom";
import React from "react";

import AppThemeProvider from "./ContextProviders/AppTheme.js";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures.js";
import router from "./Router/router.js";

const App = (): React.JSX.Element => {
    return (
        <AppThemeProvider>
            <AppFeatureProvider>
                <RouterProvider router={router} />
            </AppFeatureProvider>
        </AppThemeProvider>
    );
};

export default App;
