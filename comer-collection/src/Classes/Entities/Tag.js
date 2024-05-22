import React from "react";
import { useTableRowItem } from "../../ContextProviders/TableRowProvider.js";
import { Entity } from "../Entity.js";
import { Stack, Typography } from "@mui/material";
import { ImageIcon, SellIcon } from "../../Imports/Icons.js";

class Tag extends Entity {
    static baseUrl = "/api/admin/tags";
    static singular = "tag";
    static plural = "tags";

    static fieldDefinitions = [
        {
            fieldName: "data",
            displayName: "Tag",
            isRequired: true
        },
        {
            fieldName: "notes",
            displayName: "Notes",
            isRequired: false,
            inputType: "textarea",
            multiline: true
        }
    ];

    static searchBoxFields = ["data", "notes"];

    static TableCells = {
        ID () {
            const tag = useTableRowItem();
            return (
                <Typography variant="body1">
                    {tag.id}
                </Typography>
            );
        },
        Data () {
            const tag = useTableRowItem();
            return (
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <SellIcon />

                    <Typography variant="body1">
                        {tag.data}
                    </Typography>
                </Stack>
            );
        },
        ImageCount () {
            const tag = useTableRowItem();
            return (
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <ImageIcon />

                    <Typography variant="body1">
                        {tag.Images.length}
                    </Typography>
                </Stack>
            );
        },
        Notes () {
            const tag = useTableRowItem();
            return (tag.notes &&
                <Typography variant="body1">
                    {tag.notes}
                </Typography>
            ) || (!tag.notes &&
                <Typography
                    sx={{ opacity: 0.5 }}
                    variant="body1"
                />
            );
        },
        ManageEditButton () {
            return (
                <Entity.TableCells.EntityManageEditButton />
            );
        },
        ManageDeleteButton () {
            const tag = useTableRowItem();
            return (
                <Entity.TableCells.EntityManageDeleteButton
                    disabled={tag.Images.length > 0}
                />
            );
        },
        ManageOptionsArray () {
            return (
                <Stack direction="row">
                    <Tag.TableCells.ManageEditButton />

                    <Tag.TableCells.ManageDeleteButton />
                </Stack>
            );
        }
    };

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: Tag.TableCells.ID,
            generateSortableValue: (tag) => tag.id
        },
        {
            columnDescription: "Data",
            maxWidth: "300px",
            TableCellComponent: Tag.TableCells.Data,
            generateSortableValue: (tag) => tag.data.toLowerCase()
        },
        {
            columnDescription: "Images",
            TableCellComponent: Tag.TableCells.ImageCount
        },
        {
            columnDescription: "Notes",
            TableCellComponent: Tag.TableCells.Notes
        },
        {
            columnDescription: "Options",
            TableCellComponent: Tag.TableCells.ManageOptionsArray
        }
    ];
}

export { Tag };
