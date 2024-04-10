import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/SignIn.js";
import NavBar from "./Components/NavBar.js";
import React, { Suspense, lazy } from "react";

import { Box } from "@mui/material";
import { CollectionBrowser } from "./Pages/Browsers/CollectionBrowser.js";
import { ExhibitionBrowser } from "./Pages/Browsers/ExhibitionBrowser.js";
import { AppFeatureProvider } from "./ContextProviders/AppFeatures.js";
import { AppUserProvider } from "./ContextProviders/AppUser.js";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { FullPageMessage } from "./Components/FullPageMessage.js";
import { AccessTimeIcon } from "./Imports/Icons.js";


const ExhibitionPage = lazy(() => import("./Pages/ExhibitionPage.js"));
const ExhibitionPageWrapper = () => (
    <Suspense fallback={<FullPageMessage message="Loading exhibition viewer..." Icon={AccessTimeIcon} />}>
        <ExhibitionPage />
    </Suspense>
);


const Account = lazy(() => import("./Pages/Account.js"));
const AccountWrapper = () => (
    <Suspense fallback={<FullPageMessage message="Loading account..." Icon={AccessTimeIcon} />}>
        <Account />
    </Suspense>
);


const App = () => {

    const cache = createCache({
        key: "comer-emotion-nonce-cache",
        nonce: Math.random().toString(36).slice(2)
    });

    return (
        <CacheProvider value={cache}>
            <HelmetProvider>
                <Helmet>
                    <meta httpEquiv='Content-Security-Policy' 
                        content={`default-src 'none'; script-src 'self'; style-src 'nonce-${cache.nonce}'; img-src 'self' ${process.env.REACT_APP_API_HOST}; connect-src 'self' ${process.env.REACT_APP_API_HOST}`} />
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
                        }}>
                            <NavBar sx={{ gridArea: "header" }} />
                            <Box sx={{ gridArea: "body", position: "relative" }} >
                                <Routes>
          
                                    <Route index element={<Navigate to="/SignIn" />} />
          
                                    <Route path="/BrowseCollection" element={<CollectionBrowser isDialogMode={false} />} />
                                    <Route path="/Exhibitions" element={<ExhibitionBrowser />} />
                                    <Route path="/Exhibitions/:exhibitionId" element={<ExhibitionPageWrapper />} />

                                    <Route path="/Account/*" element={<AccountWrapper />} />

                                    <Route path="/SignIn" element={<SignIn />} />
                                    <Route path="*" element={<Navigate to="/SignIn" />} replace />
              
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