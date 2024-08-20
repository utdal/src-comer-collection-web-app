import React from "react";
import { Stack, Typography } from "@mui/material";

const NavBarLogo = (): React.JSX.Element => {
    return (
        <Stack
            alignItems="center"
            direction="row"
            height="64px"
            paddingLeft={2}
            spacing={1}
        >
            <img
                height="48px"
                src="/images/logo_image_only_orange.png"
            />

            <Typography
                sx={{ fontWeight: "bold" }}
                variant="h5"
            >
                Comer Collection
            </Typography>
        </Stack>
    );
};

export default NavBarLogo;
