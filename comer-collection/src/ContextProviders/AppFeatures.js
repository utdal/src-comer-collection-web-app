import { Snackbar, Alert, Stack, Typography } from "@mui/material";
import React, { useCallback, useContext, useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";

let defaultTitleSuffix = "Comer Collection";

const AppFeatureContext = createContext();

export const AppFeatureProvider = ({ children }) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [titleText, setTitleText] = useState(null);
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
        <AppFeatureContext.Provider value={{showSnackbar, setTitleText}}>
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

