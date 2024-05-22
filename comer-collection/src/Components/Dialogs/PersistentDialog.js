import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Dialog } from "@mui/material";

/**
 * Creates a dialog that behaves as a form and is
 * resistant to being closed by accident
 * @param {{
 *  maxWidth: ('xs'|'sm'|'md'|'lg'|'xl')
 * }} props
 * @returns
 */
export const PersistentFormDialog = ({ children, maxWidth, onClose, onSubmit, open }) => {
    const handleClose = useCallback((event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        onClose();
    }, [onClose]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit();
    }, [onSubmit]);

    return (
        <Dialog
            component="form"
            disableEscapeKeyDown
            fullWidth
            maxWidth={maxWidth}
            onClose={handleClose}
            onSubmit={handleSubmit}
            open={open}
            sx={{ zIndex: 10000 }}
        >
            {children}
        </Dialog>
    );
};

PersistentFormDialog.propTypes = {
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.oneOf([
        PropTypes.exact("xs"),
        PropTypes.exact("sm"),
        PropTypes.exact("md"),
        PropTypes.exact("lg"),
        PropTypes.exact("xl")
    ]).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
