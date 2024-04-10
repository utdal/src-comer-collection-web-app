import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/SignIn.js";
import NavBar from "./Components/NavBar.js";
import React, { Suspense, lazy, useState } from "react";

import { Box, ThemeProvider, createTheme } from "@mui/material";
import { green, grey, orange } from "@mui/material/colors/index.js";
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

    const [appDarkTheme, setAppDarkTheme] = useState(true);

    const primaryColor = green;
    const secondaryColor = orange;

    const cache = createCache({
        key: "comer-emotion-nonce-cache",
        nonce: Math.random().toString(36).slice(2)
    });

    const theme = createTheme({
        typography: {
            fontFamily: [
                "Helvetica"
            ].join(","),
            fontSize: 12,
            body1: {
                fontWeight: 500,
                fontSize: "0.9rem"
            }
        },
        palette: {
            mode: appDarkTheme ? "dark" : "light",
            primary: {
                main: appDarkTheme ? primaryColor["700"] : primaryColor["900"],
                light: primaryColor["500"],
                contrastText: "white",
                "200": primaryColor["200"],
                "100": primaryColor["100"],
                translucent: `${primaryColor["700"]}40`,
                veryTranslucent: `${primaryColor["700"]}20`
            },
            secondary: {
                main: secondaryColor["700"],
                contrastText: "white",
                "200": secondaryColor["200"],
                "100": secondaryColor["100"],
                translucent: `${secondaryColor["700"]}40`,
                veryTranslucent: `${secondaryColor["700"]}20`
            },
            grey: {
                main: grey["600"],
                contrastText: "white",
                translucent: appDarkTheme ? grey["800"] : "#CCC",
                veryTranslucent: appDarkTheme ? "#333" : "#EEE",
            },
            lightgrey: {
                main: grey["500"]
            }
        }
    });



    return (
        <CacheProvider value={cache}>
            <HelmetProvider>
                <Helmet>
                    <meta httpEquiv='Content-Security-Policy' 
                        content={`default-src 'none'; script-src 'self'; style-src 'nonce-${cache.nonce}'; img-src 'self' ${process.env.REACT_APP_API_HOST}; connect-src 'self' ${process.env.REACT_APP_API_HOST}`} />
                </Helmet>
            </HelmetProvider>
            <AppUserProvider>
                <ThemeProvider theme={theme}>
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
                            <NavBar {...{appDarkTheme, setAppDarkTheme}} sx={{ gridArea: "header" }} />
                            <Box sx={{ gridArea: "body", position: "relative" }} >

                                <AppFeatureProvider >
                                    <Routes>
          
                                        <Route index element={<Navigate to="/SignIn" />} />
          
                                        <Route path="/BrowseCollection" element={<CollectionBrowser isDialogMode={false} />} />
                                        <Route path="/Exhibitions" element={<ExhibitionBrowser />} />
                                        <Route path="/Exhibitions/:exhibitionId" element={<ExhibitionPageWrapper />} />

                                        <Route path="/Account/*" element={<AccountWrapper />} />

                                        <Route path="/SignIn" element={<SignIn />} />
                                        <Route path="*" element={<Navigate to="/SignIn" />} replace />

              
                                    </Routes>
                                </AppFeatureProvider>
                                    
                            </Box>
                        </Box>
        
                    </BrowserRouter>
      
      

                </ThemeProvider>
            </AppUserProvider>
        </CacheProvider>
    );
};

export default App;