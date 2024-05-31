import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Alert, Snackbar, Stack } from "@mui/material";

const AppSnackbar = ({ snackbarOpen, setSnackbarOpen, snackbarSeverity, snackbarText }) => {
    const closeSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, [setSnackbarOpen]);

    return (
        <Snackbar
            onClose={closeSnackbar}
            open={snackbarOpen}
        >
            <Alert severity={snackbarSeverity}>
                <Stack
                    direction="row"
                    spacing={2}
                >
                    {snackbarText}
                </Stack>
            </Alert>
        </Snackbar>
    );
};

AppSnackbar.propTypes = {
    setSnackbarOpen: PropTypes.func,
    snackbarOpen: PropTypes.bool,
    snackbarSeverity: PropTypes.string,
    snackbarText: PropTypes.string
};

export default AppSnackbar;
