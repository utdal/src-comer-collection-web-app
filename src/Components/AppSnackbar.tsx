import React, { useCallback } from "react";
import { Alert, Snackbar, Stack } from "@mui/material";

export type SnackbarSeverity = "error" | "info" | "success" | "warning";

const AppSnackbar = ({ snackbarOpen, setSnackbarOpen, snackbarSeverity, snackbarText }: {
    readonly snackbarSeverity: SnackbarSeverity;
    readonly snackbarOpen: boolean;
    readonly setSnackbarOpen: (isOpen: boolean) => void;
    readonly snackbarText: string;
}): React.JSX.Element => {
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

export default AppSnackbar;
