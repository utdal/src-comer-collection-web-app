import { Stack, Typography } from "@mui/material";
import React from "react";
import useAppUser from "../../Hooks/useAppUser";
import { InfoIcon, SecurityIcon } from "../../Imports/Icons";
import type { AppUser } from "../../index.js";

const ExhibitionCreationRestriction = (): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;
    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{ gridArea: "comment", justifyContent: "center" }}
        >
            {appUser.is_admin
                ? (
                    <Stack
                        color="gray"
                        direction="row"
                        spacing={2}
                    >
                        <SecurityIcon color="secondary" />

                        <Typography variant="body1">
                            Restrictions on exhibition creation are removed for administrators.
                        </Typography>
                    </Stack>
                )
                : null}

            {!appUser.is_admin && appUser.Courses.filter((c) => c.status === "Active").length === 0 && (
                <Stack
                    color="gray"
                    direction="row"
                    spacing={2}
                >
                    <InfoIcon />

                    <Typography variant="body1">
                        You must be enrolled in at least one active course to create exhibitions.
                    </Typography>
                </Stack>
            )}

            {!appUser.is_admin && appUser.Exhibitions.length >= appUser.exhibition_quota && (
                <Stack
                    color="gray"
                    direction="row"
                    spacing={2}
                >
                    <InfoIcon />

                    <Typography variant="body1">
                        Your account has reached its exhibition quota.  To create an exhibition, first delete an existing exhibition, or contact your instructor to request a quota increase.
                    </Typography>
                </Stack>
            )}
        </Stack>
    );
};

export default ExhibitionCreationRestriction;
