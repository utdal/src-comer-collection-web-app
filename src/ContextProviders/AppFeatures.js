import React, { useCallback, useContext, useState, createContext, useMemo, useEffect } from "react";
import createCache from "@emotion/cache";

import PropTypes from "prop-types";

import { CacheProvider } from "@emotion/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AppSnackbar from "../Components/AppSnackbar.tsx";

const defaultTitleSuffix = "Comer Collection";

const AppFeatureContext = createContext();

export const AppFeatureProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [titleText, setTitleText] = useState(null);

    const showSnackbar = useCallback((message, severity = "info") => {
        setSnackbarText(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, [setSnackbarOpen, setSnackbarSeverity, setSnackbarText]);

    const appFeatureContextValue = useMemo(() => {
        return {
            showSnackbar,
            setTitleText
        };
    }, [showSnackbar, setTitleText]);

    const cache = useMemo(() => createCache({
        key: "comer-emotion-nonce-cache",
        nonce: Math.random().toString(36).slice(2)
    }), []);

    return (
        <AppFeatureContext.Provider value={appFeatureContextValue}>
            <CacheProvider value={cache}>
                <HelmetProvider>
                    <Helmet>
                        <title>
                            {titleText
                                ? `${titleText} - ${defaultTitleSuffix}`
                                : `${defaultTitleSuffix}`}
                        </title>

                        <meta
                            content={`default-src 'none'; manifest-src 'self'; script-src 'self'; style-src 'nonce-${cache.nonce}'; img-src 'self' ${process.env.REACT_APP_API_HOST}; connect-src 'self' ${process.env.REACT_APP_API_HOST}`}
                            httpEquiv='Content-Security-Policy'
                        />
                    </Helmet>
                </HelmetProvider>

                {children}

                <AppSnackbar
                    setSnackbarOpen={setSnackbarOpen}
                    snackbarOpen={snackbarOpen}
                    snackbarSeverity={snackbarSeverity}
                    snackbarText={snackbarText}
                />

            </CacheProvider>
        </AppFeatureContext.Provider>
    );
};

AppFeatureProvider.propTypes = {
    children: PropTypes.node.isRequired
};

/**
 * Allows components within an AppFeaturesProvider to trigger the snackbar
 * @returns {function} showSnackbar
 */
export const useSnackbar = () => {
    const { showSnackbar } = useContext(AppFeatureContext);
    return showSnackbar;
};

/**
 * Change the webpage title displayed in the browser tab
 * @param {string} defaultTitleText
 * @returns {function} setTitleText(newTitleText)
 */
export const useTitle = (defaultTitleText) => {
    const { setTitleText } = useContext(AppFeatureContext);
    useEffect(() => {
        setTitleText(defaultTitleText);
    }, [defaultTitleText, setTitleText]);
    return setTitleText;
};

export const useClipboard = () => {
    const { showSnackbar } = useContext(AppFeatureContext);
    return useCallback((textToCopy) => {
        try {
            navigator.clipboard.writeText(textToCopy);
            showSnackbar("Copied to clipboard", "success");
        } catch (error) {
            showSnackbar("Error copying text to clipboard", "error");
        }
    }, [showSnackbar]);
};
