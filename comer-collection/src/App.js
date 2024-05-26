/* eslint-disable react/no-multi-comp */
import { Navigate, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import SignIn from "./Pages/SignIn.js";
import React from "react";

import { CollectionBrowser } from "./Pages/Browsers/CollectionBrowser.js";
import { ExhibitionBrowser } from "./Pages/Browsers/ExhibitionBrowser.js";

import { ExhibitionPageWrapper } from "./Components/LazyLoaders/ExhibitionPageWrapper.js";
import { AccountWrapper } from "./Components/LazyLoaders/AccountWrapper.js";
import AppLayout from "./AppLayout.js";

const TempAppRoot = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route
                    element={<Navigate to="/SignIn" />}
                    index
                />

                <Route
                    element={<CollectionBrowser isDialogMode={false} />}
                    path="/BrowseCollection"
                />

                <Route
                    element={<ExhibitionBrowser />}
                    path="/Exhibitions"
                />

                <Route
                    element={<ExhibitionPageWrapper />}
                    path="/Exhibitions/:exhibitionId"
                />

                <Route
                    element={<AccountWrapper />}
                    path="/Account/*"
                />

                <Route
                    element={<SignIn />}
                    path="/SignIn"
                />

                <Route
                    element={<Navigate to="/SignIn" />}
                    path="*"
                    replace
                />
            </Route>
        </Routes>
    );
};

const router = createBrowserRouter([
    {
        path: "*",
        element: <TempAppRoot />
    }
]);

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;
