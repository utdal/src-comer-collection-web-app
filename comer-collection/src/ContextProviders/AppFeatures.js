import { ThemeProvider, createTheme } from "@mui/material";
import React, { useCallback, useContext, useState, createContext, useMemo, useEffect } from "react";
import createCache from "@emotion/cache";

import PropTypes from "prop-types";

import { green, grey, orange } from "@mui/material/colors/index.js";
import { CacheProvider } from "@emotion/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AppSnackbar from "../Components/AppSnackbar.js";

const defaultTitleSuffix = "Comer Collection";

const primaryColor = green;
const secondaryColor = orange;

const AppFeatureContext = createContext();

export const AppFeatureProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [titleText, setTitleText] = useState(null);

    const [appDarkTheme, setAppDarkTheme] = useState(JSON.parse(localStorage.getItem("appDarkTheme")) ?? false);

    const finalTheme = useMemo(() => (createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...theme.typography.body1
                    })
                },
                variants: [
                    {
                        props: { variant: "outlined" },
                        style: {
                            borderWidth: "2px !important"
                        }
                    }
                ]
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...theme.typography.h6
                    })
                }
            },
            MuiStack: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...theme.typography.body1
                    })
                }
            },
            MuiDialog: {
                defaultProps: {
                    disableEscapeKeyDown: true
                },
                styleOverrides: {
                    root: {
                        zIndex: 10000
                    }
                }
            },
            MuiFab: {
                styleOverrides: {
                    root: {
                        zIndex: 8000
                    }
                }
            },
            MuiDialogTitle: {
                defaultProps: {
                    textAlign: "center",
                    variant: "h4"
                }
            },
            MuiTable: {
                defaultProps: {
                    size: "small",
                    stickyHeader: true
                }
            },
            MuiTableContainer: {
                styleOverrides: {
                    root: () => ({
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        gridTemplateAreas: `
                            "header"
                            "rows"
                        `,
                        gridTemplateRows: "40px calc(100% - 40px)"
                    })
                },
                defaultProps: {

                }
            },
            MuiTableHead: {
                styleOverrides: {
                    root: () => ({
                        gridArea: "header"
                    })
                }
            },
            MuiTableBody: {
                styleOverrides: {
                    root: () => ({
                        gridArea: "rows"
                    })
                }
            },
            MuiSnackbar: {
                defaultProps: {
                    anchorOrigin: {
                        horizontal: "center",
                        vertical: "bottom"
                    },
                    autoHideDuration: 3000
                },
                styleOverrides: {
                    root: () => ({
                        zIndex: 10000000
                    })
                }
            },
            MuiTextField: {
                defaultProps: {
                    autoComplete: "off"
                }
            }
        },
        typography: {
            fontFamily: "Helvetica",
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
                200: primaryColor["200"],
                100: primaryColor["100"],
                translucent: `${primaryColor["700"]}40`,
                veryTranslucent: `${primaryColor["700"]}20`
            },
            secondary: {
                main: secondaryColor["700"],
                contrastText: "white",
                200: secondaryColor["200"],
                100: secondaryColor["100"],
                translucent: `${secondaryColor["700"]}40`,
                veryTranslucent: `${secondaryColor["700"]}20`
            },
            grey: {
                main: grey["600"],
                contrastText: appDarkTheme ? "white" : "black",
                translucent: appDarkTheme ? grey["800"] : "#CCC",
                veryTranslucent: appDarkTheme ? "#333" : "#EEE"
            },
            lightgrey: {
                main: appDarkTheme ? grey["500"] : grey["700"]
            }
        }
    })), [appDarkTheme]);

    const showSnackbar = useCallback((message, severity = "info") => {
        setSnackbarText(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, [setSnackbarOpen, setSnackbarSeverity, setSnackbarText]);

    const appFeatureContextValue = useMemo(() => {
        return {
            showSnackbar,
            setTitleText,
            appDarkTheme,
            setAppDarkTheme
        };
    }, [showSnackbar, setTitleText, appDarkTheme, setAppDarkTheme]);

    const cache = useMemo(() => createCache({
        key: "comer-emotion-nonce-cache",
        nonce: Math.random().toString(36).slice(2)
    }), []);

    return (
        <AppFeatureContext.Provider value={appFeatureContextValue}>

            <ThemeProvider theme={finalTheme}>
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
            </ThemeProvider>
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

export const useAppDarkTheme = () => {
    const { appDarkTheme, setAppDarkTheme } = useContext(AppFeatureContext);
    const handleDarkThemeChange = useCallback((isEnabled) => {
        setAppDarkTheme(isEnabled);
        localStorage.setItem("appDarkTheme", JSON.stringify(isEnabled));
    }, [setAppDarkTheme]);
    return { appDarkTheme, setAppDarkTheme: handleDarkThemeChange };
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
