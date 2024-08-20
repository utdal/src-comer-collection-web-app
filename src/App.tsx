/* eslint-disable react/no-multi-comp */
import { RouterProvider } from "react-router-dom";
import React from "react";

import AppThemeProvider from "./ContextProviders/AppTheme";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures";
import router from "./Router/router";

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
