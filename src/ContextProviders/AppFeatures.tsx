import type { ReactNode } from "react";
import React, { useCallback, useContext, useState, createContext, useMemo, useEffect } from "react";
import type { EmotionCache } from "@emotion/cache";
import createCache from "@emotion/cache";

import { CacheProvider } from "@emotion/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import type { SnackbarSeverity } from "../Components/AppSnackbar.tsx";
import AppSnackbar from "../Components/AppSnackbar.tsx";

const defaultTitleSuffix = "Comer Collection";

type SnackbarShower = (message: string, severity: SnackbarSeverity) => void;
type TitleSetter = (newTitleText: string) => void;
type ClipboardWriter = (textToCopy: string) => void;

interface AppFeatureContextValue {
    showSnackbar: SnackbarShower;
    setTitleText: TitleSetter;
}

interface AppEmotionCache extends EmotionCache {
    nonce: string;
}

interface AppProcessEnv extends NodeJS.ProcessEnv {
    REACT_APP_API_HOST: string;
}

const cache = createCache({
    key: "comer-emotion-nonce-cache",
    nonce: Math.random().toString(36).slice(2)
}) as AppEmotionCache;

const processEnv = (process.env) as AppProcessEnv;

const AppFeatureContext = createContext((null as unknown) as AppFeatureContextValue);

export const AppFeatureProvider = ({ children }: {
    readonly children: ReactNode;
}): React.JSX.Element => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success" as SnackbarSeverity);

    const [titleText, setTitleText] = useState("" as string);

    const showSnackbar: SnackbarShower = useCallback((message, severity = "info") => {
        setSnackbarText(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, [setSnackbarOpen, setSnackbarSeverity, setSnackbarText]);

    const appFeatureContextValue: AppFeatureContextValue = useMemo(() => {
        return {
            showSnackbar,
            setTitleText
        };
    }, [showSnackbar, setTitleText]);

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
                            content={`default-src 'none'; manifest-src 'self'; script-src 'self'; style-src 'nonce-${cache.nonce}'; img-src 'self' ${processEnv.REACT_APP_API_HOST}; connect-src 'self' ${processEnv.REACT_APP_API_HOST}`}
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

/**
 * @description Allows components within an AppFeaturesProvider to trigger the snackbar
 */
export const useSnackbar = (): SnackbarShower => {
    const { showSnackbar } = useContext(AppFeatureContext);
    return showSnackbar;
};

/**
 * @description Change the webpage title displayed in the browser tab
 */
export const useTitle = (defaultTitleText: string): TitleSetter => {
    const { setTitleText } = useContext(AppFeatureContext);
    useEffect(() => {
        setTitleText(defaultTitleText);
    }, [defaultTitleText, setTitleText]);
    return setTitleText;
};

export const useClipboard = (): ClipboardWriter => {
    const { showSnackbar } = useContext(AppFeatureContext);
    const clipboardWriter: ClipboardWriter = useCallback((textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showSnackbar("Copied to clipboard", "success");
        }).catch(() => {
            showSnackbar("Error copying text to clipboard", "error");
        });
    }, [showSnackbar]);
    return clipboardWriter;
};
