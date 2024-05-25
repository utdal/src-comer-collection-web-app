import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/SignIn.js";
import NavBar from "./Components/NavBar/NavBar.js";
import React from "react";

import { Box } from "@mui/material";
import { CollectionBrowser } from "./Pages/Browsers/CollectionBrowser.js";
import { ExhibitionBrowser } from "./Pages/Browsers/ExhibitionBrowser.js";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures.js";
import { AppUserProvider } from "./ContextProviders/AppUser.js";

import { ExhibitionPageWrapper } from "./Components/LazyLoaders/ExhibitionPageWrapper.js";
import { AccountWrapper } from "./Components/LazyLoaders/AccountWrapper.js";

const App = () => {
    return (

        <AppFeatureProvider >
            <AppUserProvider>
                <BrowserRouter>
                    <Box sx={{
                        height: "100vh",
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gridTemplateRows: "64px calc(100vh - 64px)",
                        gridTemplateAreas: `
                                "header"
                                "body"
                            `
                    }}
                    >
                        <NavBar sx={{ gridArea: "header" }} />

                        <Box sx={{ gridArea: "body", position: "relative" }} >
                            <Routes>

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

                            </Routes>

                        </Box>
                    </Box>

                </BrowserRouter>

            </AppUserProvider>
        </AppFeatureProvider>
    );
};

export default App;
