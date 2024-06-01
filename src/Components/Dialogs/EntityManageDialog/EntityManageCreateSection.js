import React, { useCallback, useMemo, useState } from "react";
import { Box, Button, DialogContentText, Stack, TextField } from "@mui/material";
import { useEntity } from "../../../ContextProviders/ManagementPageProvider.js";
import { getBlankItemFields } from "../../../Helpers/fields.js";
import { useSnackbar } from "../../../ContextProviders/AppFeatures";
import { AddIcon } from "../../../Imports/Icons.js";

const EntityManageCreateSection = () => {
    const Entity = useEntity();
    const showSnackbar = useSnackbar();

    const blankItem = useMemo(() => getBlankItemFields(Entity.fieldDefinitions), [Entity.fieldDefinitions]);
    const [itemToAdd, setItemToAdd] = useState(blankItem);

    const singularCapitalized = Entity?.singular.substr(0, 1).toUpperCase() + Entity?.singular.substr(1).toLowerCase();

    const handleCreate = useCallback(() => {
        Entity.handleMultiCreate([itemToAdd]).then(([{ status }]) => {
            if (status === "fulfilled") {
                showSnackbar(`${singularCapitalized} created`, "success");
            } else {
                showSnackbar(`Failed to create ${Entity.singular}`, "error");
            }
        });
        setItemToAdd(blankItem);
    }, [Entity, itemToAdd, blankItem, showSnackbar, singularCapitalized]);

    return (
        <Box
            component="form"
            onSubmit={handleCreate}
            sx={{ gridArea: "create" }}
        >
            <Stack spacing={2}>
                <DialogContentText
                    textAlign="left"
                    variant="h6"
                >
                    {"Create a new "}

                    {Entity.singular}
                </DialogContentText>

                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-around"
                    spacing={2}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        spacing={2}
                        useFlexGap
                    >
                        {Entity.fieldDefinitions.map((f, fi) => (
                            <TextField
                                autoFocus={fi === 0}
                                inputProps={{
                                    type: f.inputType ?? "text",
                                    sx: {
                                        ...{
                                            textAlign: f.inputType === "datetime-local" ? "center" : ""
                                        }
                                    }
                                }}
                                key={f.fieldName}
                                label={f.displayName}
                                minRows={2}
                                multiline={f.multiline}
                                name={f.fieldName}
                                onChange={(e) => {
                                    setItemToAdd({
                                        ...itemToAdd,
                                        [f.fieldName]: e.target.value
                                    });
                                }}
                                required={Boolean(f.isRequired)}
                                sx={{
                                    minWidth: "200px"
                                }}
                                value={itemToAdd[f.fieldName]}
                            />
                        ))}

                    </Stack>

                    <Button
                        startIcon={<AddIcon />}
                        sx={{ minWidth: "200px", height: "100%" }}
                        type="submit"
                        variant="contained"
                    >
                        {`Create ${Entity.singular}`}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default EntityManageCreateSection;
