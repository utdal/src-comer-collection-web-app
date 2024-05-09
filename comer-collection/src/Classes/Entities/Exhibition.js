/* eslint-disable react/prop-types */
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Entity } from "../Entity.js";
import React, { useCallback } from "react";
import { LockIcon, OpenInNewIcon, PublicIcon, SettingsIcon, VpnLockIcon } from "../../Imports/Icons.js";
import { useTableRowItem } from "../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

class Exhibition extends Entity {
    static baseUrl = "/api/admin/exhibitions";
    static singular = "exhibition";
    static plural = "exhibitions";

    static handleMultiCreate () {
        return Promise.reject(new Error("MultiCreate is not allowed for exhibitions"));
    }

    static TableCells = {
        ID () {
            const exhibition = useTableRowItem();
            return (
                <Typography variant="body1">{exhibition.id}</Typography>
            );
        },
        Title () {
            const exhibition = useTableRowItem();
            return (
                exhibition.title
                    ? <Typography variant="body1">{exhibition.title}</Typography>
                    : <Typography variant="body1" sx={{ opacity: 0.5 }}>Not set</Typography>
            );
        },
        OwnerStackedNameEmail () {
            const { User: owner } = useTableRowItem();
            return (
                <Stack direction="column" paddingTop={1} paddingBottom={1}>
                    <Typography variant="body1">{owner.full_name_reverse}</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>{owner.email}</Typography>
                </Stack>
            );
        },
        OpenInNewTab () {
            const exhibition = useTableRowItem();
            return (
                <Button variant="outlined" endIcon={<OpenInNewIcon />} href={`/Exhibitions/${exhibition.id}`} target="_blank">
                    <Typography variant="body1">Open</Typography>
                </Button>
            );
        },
        DateCreated () {
            const exhibition = useTableRowItem();
            return (
                <Typography variant="body1">{Entity.formatDate(exhibition.date_created)}, {Entity.formatTime(exhibition.date_created)}</Typography>
            );
        },
        DateModified () {
            const exhibition = useTableRowItem();
            return (
                <Typography variant="body1">{Entity.formatDate(exhibition.date_modified)}, {Entity.formatTime(exhibition.date_modified)}</Typography>
            );
        },
        DateCreatedStacked () {
            const exhibition = useTableRowItem();
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
        DateModifiedStacked () {
            const exhibition = useTableRowItem();
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
        Access () {
            const exhibition = useTableRowItem();
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    {(exhibition.privacy === "PRIVATE" &&
                        <LockIcon color="grey" />
                    ) || (exhibition.privacy === "PUBLIC_ANONYMOUS" &&
                        <VpnLockIcon color="grey" />
                    ) || (exhibition.privacy === "PUBLIC" &&
                        <PublicIcon color="grey" />
                    )}
                    <Typography variant="body1">{(exhibition.privacy === "PRIVATE" &&
                        "Private"
                    ) || (exhibition.privacy === "PUBLIC_ANONYMOUS" &&
                        "Public Anonymous"
                    ) || (exhibition.privacy === "PUBLIC" &&
                        "Public"
                    )}</Typography>
                </Stack>
            );
        },
        ExhibitionSettingsButton ({ onClick, disabled }) {
            return (
                <IconButton {...{ onClick, disabled }}>
                    <SettingsIcon />
                </IconButton>
            );
        },
        DeleteButton ({ onClick }) {
            return (
                <Entity.TableCells.DeleteButton {...{ onClick }} />
            );
        },
        ExhibitionOptions () {
            const exhibition = useTableRowItem();
            const { handleOpenExhibitionSettings, handleOpenExhibitionDeleteDialog } = useManagementCallbacks();
            const handleOpenSettings = useCallback(() => {
                handleOpenExhibitionSettings(exhibition);
            });
            const handleOpenDeleteDialog = useCallback(() => {
                handleOpenExhibitionDeleteDialog(exhibition);
            });
            return (
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" endIcon={<OpenInNewIcon />} href={`/Exhibitions/${exhibition.id}`} target="_blank">
                        <Typography variant="body1">Open</Typography>
                    </Button>
                    <Exhibition.TableCells.ExhibitionSettingsButton
                        onClick={handleOpenSettings}
                    />
                    <Exhibition.TableCells.DeleteButton
                        onClick={handleOpenDeleteDialog}
                    />
                </Stack>
            );
        }
    };
}

class MyExhition extends Exhibition {
    static baseUrl = "/api/user/exhibitions";
}

export { Exhibition, MyExhition };
