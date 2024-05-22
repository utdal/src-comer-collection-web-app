import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/SignIn.js";
import NavBar from "./Components/NavBar/NavBar.js";
import React from "react";

import { Box } from "@mui/material";
import { CollectionBrowser } from "./Pages/Browsers/CollectionBrowser.js";
import { ExhibitionBrowser } from "./Pages/Browsers/ExhibitionBrowser.js";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures.js";
import { AppUserProvider } from "./ContextProviders/AppUser.js";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ExhibitionPageWrapper } from "./Components/LazyLoaders/ExhibitionPageWrapper.js";
import { AccountWrapper } from "./Components/LazyLoaders/AccountWrapper.js";

const App = () => {
    const cache = createCache({
        key: "comer-emotion-nonce-cache",
        nonce: Math.random().toString(36).slice(2)
    });

    return (
        <CacheProvider value={cache}>
            <HelmetProvider>
                <Helmet>
                    <meta
                        content={`default-src 'none'; script-src 'self'; style-src 'nonce-${cache.nonce}'; img-src 'self' ${process.env.REACT_APP_API_HOST}; connect-src 'self' ${process.env.REACT_APP_API_HOST}`}
                        httpEquiv='Content-Security-Policy'
                    />
                </Helmet>
            </HelmetProvider>

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
        </CacheProvider>
    );
};

export default App;
