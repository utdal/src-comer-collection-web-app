/* eslint-disable react/prop-types */
import { Stack, Typography } from "@mui/material";
import { Entity } from "./Entity.js";
import React from "react";
import { LockIcon, PublicIcon, VpnLockIcon } from "../../../IconImports.js";

class Exhibition extends Entity {
    static baseUrl = "/api/admin/exhibitions";
    static singular = "exhibition";
    static plural = "exhibitions";

    static handleMultiCreate() {
        return Promise.reject("MultiCreate is not allowed for exhibitions");
    }

    static TableCells = {
        DateCreated({ exhibition }) {
            return (
                <Typography variant="body1">{Entity.formatDate(exhibition.date_created)}, {Entity.formatTime(exhibition.date_created)}</Typography>
            );
        },
        DateModified({ exhibition }) {
            return (
                <Typography variant="body1">{Entity.formatDate(exhibition.date_modified)}, {Entity.formatTime(exhibition.date_modified)}</Typography>
            );
        },
        DateCreatedStacked({ exhibition }) {
            return (
                <Stack direction="column" padding={0}>
                    <Typography variant="body1">
                        {Exhibition.formatDate(exhibition.date_created)}
                    </Typography>
                    <Typography variant="body1">
                        {Exhibition.formatTime(exhibition.date_created)}
                    </Typography>
                </Stack>
            );
        },
        DateModifiedStacked({ exhibition }) {
            return (
                <Stack direction="column" padding={0}>
                    <Typography variant="body1">
                        {Exhibition.formatDate(exhibition.date_modified)}
                    </Typography>
                    <Typography variant="body1">
                        {Exhibition.formatTime(exhibition.date_modified)}
                    </Typography>
                </Stack>
            );
        },
        Access({ exhibition }) {
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    {exhibition.privacy == "PRIVATE" && (
                        <LockIcon color="grey" />
                    ) || exhibition.privacy == "PUBLIC_ANONYMOUS" && (
                        <VpnLockIcon color="grey" />
                    ) || exhibition.privacy == "PUBLIC" && (
                        <PublicIcon color="grey" />
                    )}
                    <Typography variant="body1">{exhibition.privacy == "PRIVATE" && (
                        "Private"
                    ) || exhibition.privacy == "PUBLIC_ANONYMOUS" && (
                        "Public Anonymous"
                    ) || exhibition.privacy == "PUBLIC" && (
                        "Public"
                    )}</Typography>
                </Stack>
            );
        }
    };
}

class MyExhition extends Exhibition {
    static baseUrl = "/api/user/exhibitions";
}

export { Exhibition, MyExhition };