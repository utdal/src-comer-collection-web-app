import { Snackbar, Alert, Stack, Typography, ThemeProvider, createTheme } from "@mui/material";
import React, { useCallback, useContext, useState, createContext, useMemo, useEffect } from "react";

import PropTypes from "prop-types";

import { green, grey, orange } from "@mui/material/colors/index.js";

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

    const finalTheme = createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...theme.typography.body1
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
            MuiDialogTitle: {
                defaultProps: {
                    textAlign: "center",
                    variant: "h4"
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
    });

    if (!titleText) {
        document.title = defaultTitleSuffix;
    } else {
        document.title = `${titleText} - ${defaultTitleSuffix}`;
    }

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

    return (
        <AppFeatureContext.Provider value={appFeatureContextValue}>

            <ThemeProvider theme={finalTheme}>
                {children}

                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    autoHideDuration={3000}
                    onClose={() => {
                        setSnackbarOpen(false);
                    }}
                    open={snackbarOpen}
                    sx={{
                        zIndex: 10000000
                    }}
                >
                    <Alert
                        severity={snackbarSeverity}
                        sx={{ width: "100%" }}
                        variant="standard"
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <Typography variant="body1">
                                {snackbarText}
                            </Typography>
                        </Stack>
                    </Alert>
                </Snackbar>
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
