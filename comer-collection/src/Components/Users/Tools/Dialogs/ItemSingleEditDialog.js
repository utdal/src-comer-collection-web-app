import React from "react";
import {
  Stack, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, DialogContentText, TextField
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { getLocalISOString } from "../HelperMethods/getLocalISOString";

export const ItemSingleEditDialog = ({ entity, dialogTitle, dialogInstructions, editDialogItem, editDialogFieldDefinitions, editDialogFields, setEditDialogFields, editDialogIsOpen, setEditDialogIsOpen, editDialogSubmitEnabled, setEditDialogSubmitEnabled, handleItemEdit }) => {
  return (
    <Dialog component="form"
      open={editDialogIsOpen}
      onClose={(event, reason) => {
        if (reason == "backdropClick")
          return;
        setEditDialogIsOpen(false);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleItemEdit(editDialogItem.id, editDialogFields);
      }}
    >
      <DialogTitle variant="h4" textAlign="center">{dialogTitle}</DialogTitle>
      <DialogContent
        sx={{
          width: "500px",
        }}>
        <Stack spacing={2}>
          <DialogContentText variant="body1">{dialogInstructions}</DialogContentText>
          {editDialogFieldDefinitions.map((f) => (
            <TextField multiline={f.multiline}
              minRows={2}
              key={f.fieldName} 
              name={f.fieldName} 
              label={f.displayName} 
              value={
                f.inputType == "datetime-local" ? 
                getLocalISOString(editDialogFields[f.fieldName]) :
                editDialogFields[f.fieldName]
              }
              inputProps={{
                type: f.inputType,
                onChange: (e) => {
                  setEditDialogFields({ ...editDialogFields, [f.fieldName]: e.target.value });
                }
              }}
              >
            </TextField>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
          <Button color="primary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
            setEditDialogIsOpen(false);
            setEditDialogSubmitEnabled(false);
          }}>
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button color="primary" variant="contained" size="large" startIcon={<SaveIcon />} sx={{ width: "100%" }}
            // disabled={!Boolean(editDialogSubmitEnabled && editDialogFields.email)}
            type="submit">
            <Typography variant="body1">Save {entity}</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
