import { Snackbar, Alert, Stack, Typography } from "@mui/material";
import React, { useCallback, useContext, useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material";
import { green, grey, orange } from "@mui/material/colors/index.js";
import { AppSettingsDialog } from "../Components/Dialogs/AppSettingsDialog.js";

let defaultTitleSuffix = "Comer Collection";


const primaryColor = green;
const secondaryColor = orange;

const AppFeatureContext = createContext();

export const AppFeatureProvider = ({ children }) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [titleText, setTitleText] = useState(null);

    const [appDarkTheme, setAppDarkTheme] = useState(false);

    const [appSettingsDialogIsOpen, setAppSettingsDialogIsOpen] = useState(false);
    

    const theme = createTheme({
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
                contrastText: appDarkTheme ? "white" : "black",
                translucent: appDarkTheme ? grey["800"] : "#CCC",
                veryTranslucent: appDarkTheme ? "#333" : "#EEE",
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

    return (
        <AppFeatureContext.Provider value={{
            showSnackbar, setTitleText, 
            appDarkTheme, setAppDarkTheme,
            appSettingsDialogIsOpen, setAppSettingsDialogIsOpen
        }}>
            
            <ThemeProvider theme={theme}>
                {children}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    onClose={() => {
                        setSnackbarOpen(false);
                    } }
                    sx={{
                        zIndex: 10000000
                    }}
                >
                    <Alert severity={snackbarSeverity} variant="standard" sx={{ width: "100%" }}>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="body1">{snackbarText}</Typography>
                        </Stack>
                    </Alert>
                </Snackbar>
                <AppSettingsDialog />
            </ThemeProvider>
        </AppFeatureContext.Provider>
    );
};

AppFeatureProvider.propTypes = {
    children: PropTypes.node
};


export const useSnackbar = () => {
    const { showSnackbar } = useContext(AppFeatureContext);
    return showSnackbar;
};


export const useTitle = () => {
    const { setTitleText } = useContext(AppFeatureContext);
    return setTitleText;
};

export const useAppDarkTheme = () => {
    const { appDarkTheme, setAppDarkTheme } = useContext(AppFeatureContext);
    return { appDarkTheme, setAppDarkTheme };
};

export const useAppSettingsDialog = () => {
    const { appSettingsDialogIsOpen, setAppSettingsDialogIsOpen } = useContext(AppFeatureContext);
    return { appSettingsDialogIsOpen, setAppSettingsDialogIsOpen };
};
