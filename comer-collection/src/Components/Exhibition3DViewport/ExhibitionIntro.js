import React from "react";
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography, styled } from "@mui/material";
import PropTypes from "prop-types";
import FullLogo from "../Logos/FullLogo.js";

const PositionedDialog = styled(Dialog)(() => ({
    position: "absolute",
    zIndex: 5000
}));

export const ExhibitionIntro = ({ exhibitionMetadata, controls, dialogIsOpen, setDialogIsOpen }) => {
    return (
        <PositionedDialog
            disablePortal
            fullWidth
            hideBackdrop
            maxWidth="md"
            open={dialogIsOpen}
        >
            <DialogContent>
                <Stack
                    alignItems="center"
                    spacing={2}
                >
                    <FullLogo />

                    <Typography variant="h4">
                        {exhibitionMetadata.title}
                    </Typography>

                    {exhibitionMetadata.curator
                        ? (
                            <Typography variant="h5">
                                Curated by
                                {exhibitionMetadata.curator}
                            </Typography>
                        )
                        : null}

                    <Stack
                        alignItems="center"
                        sx={{ opacity: 0.5 }}
                    >
                        <Typography>
                            Controls are paused while this menu is open.
                        </Typography>

                        <Typography>
                            This menu will reappear whenever you press ESCAPE.
                        </Typography>

                        <Typography>
                            Explore the gallery using the W-A-S-D or arrow keys on your keyboard.
                        </Typography>

                        <Typography>
                            Take a look around and turn by using your mouse or mousepad.
                        </Typography>
                    </Stack>

                    <Button
                        color="grey"
                        id="play_button"
                        onClick={() => {
                            setDialogIsOpen(false);
                            controls.lock();
                        }}
                        size="large"
                        variant="contained"
                    >
                        <Typography variant="h6">
                            Enter Exhibition
                        </Typography>
                    </Button>
                </Stack>

                <div />

            </DialogContent>

            <DialogActions />
        </PositionedDialog>
    );
};
ExhibitionIntro.propTypes = {
    controls: PropTypes.shape({
        lock: PropTypes.func
    }).isRequired,
    dialogIsOpen: PropTypes.bool.isRequired,
    exhibitionMetadata: PropTypes.shape({
        title: PropTypes.string,
        curator: PropTypes.string
    }).isRequired,
    setDialogIsOpen: PropTypes.func.isRequired
};
