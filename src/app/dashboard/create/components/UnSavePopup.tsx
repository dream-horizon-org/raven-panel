import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { JOURNEY_TEXT } from "../constants/journeyConstants";

export const UnSavePopup = ({
  showConfirmDialog,
  handleDialogCancel,
  handleConfirmDiscard,
  handleContinueEditing,
  handleConfirmSave,
}: {
  showConfirmDialog: boolean;
  handleDialogCancel: () => void;
  handleConfirmDiscard: () => void;
  handleContinueEditing: () => void;
  handleConfirmSave: () => void;
}) => {
  return (
    <Dialog
      open={showConfirmDialog}
      onClose={handleDialogCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">Unsaved Changes</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {JOURNEY_TEXT.UNSAVED_CHANGES}
          <br />
          <br />
          {JOURNEY_TEXT.UNSAVED_CHANGES_CONFIRMATION}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmDiscard} color="error" variant="outlined">
          {JOURNEY_TEXT.DISCARD}
        </Button>
        <Button
          onClick={handleContinueEditing}
          color="primary"
          variant="outlined"
        >
          {JOURNEY_TEXT.CONTINUE_EDITING}
        </Button>
        <Button
          onClick={handleConfirmSave}
          color="primary"
          variant="contained"
          autoFocus
        >
          {JOURNEY_TEXT.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
