"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS, JOURNEY_TEXT } from "../constants/journeyConstants";
import { validateTestJourneyForm } from "../utils/testJourneyValidation.utils";

interface TestFeatureDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userIds: string, expireInMins: number) => void;
  isLoading?: boolean;
  existingUserIds?: string;
  existingExpireInMins?: number;
}

export default function TestFeatureDialog({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  existingUserIds = "",
  existingExpireInMins = DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS,
}: TestFeatureDialogProps) {
  const [userIds, setUserIds] = useState("");
  const [expireInMins, setExpireInMins] = useState(String(DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS));
  const [errors, setErrors] = useState<{
    userIds?: string;
    expireInMins?: string;
  }>({});

  // Load existing values when dialog opens
  useEffect(() => {
    if (open) {
      setUserIds(existingUserIds || "");
      setExpireInMins(existingExpireInMins ? String(existingExpireInMins) : String(DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS));
      setErrors({});
    }
  }, [open, existingUserIds, existingExpireInMins]);

  const handleSubmit = () => {
    const newErrors = validateTestJourneyForm(
      userIds,
      expireInMins,
      {
        userIdsRequired: JOURNEY_TEXT.TEST_JOURNEY_DIALOG.VALIDATION.USER_IDS_REQUIRED,
        atLeastOneUserIdRequired: JOURNEY_TEXT.TEST_JOURNEY_DIALOG.VALIDATION.AT_LEAST_ONE_USER_ID_REQUIRED,
        expireInMinsRequired: JOURNEY_TEXT.TEST_JOURNEY_DIALOG.VALIDATION.EXPIRATION_TIME_REQUIRED,
      }
    );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const expireInMinsNum = parseInt(expireInMins, 10);
    onSubmit(userIds.trim(), expireInMinsNum);
  };

  const handleClose = () => {
    setUserIds("");
    setExpireInMins(String(DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS));
    setErrors({});
    onClose();
  };

  const handleUserIdsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserIds(e.target.value);
    setErrors((prevErrors) => {
      if (prevErrors.userIds) {
        return { ...prevErrors, userIds: undefined };
      }
      return prevErrors;
    });
  }, []);

  const handleExpireInMinsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExpireInMins(e.target.value);
    setErrors((prevErrors) => {
      if (prevErrors.expireInMins) {
        return { ...prevErrors, expireInMins: undefined };
      }
      return prevErrors;
    });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="test-journey-dialog-title"
      aria-describedby="test-journey-dialog-description"
    >
      <DialogTitle id="test-journey-dialog-title">
        {JOURNEY_TEXT.TEST_JOURNEY_DIALOG.TITLE}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="test-journey-dialog-description" sx={{ mb: 2 }}>
          {JOURNEY_TEXT.TEST_JOURNEY_DIALOG.DESCRIPTION}
        </DialogContentText>
        <TextField
          label={JOURNEY_TEXT.TEST_JOURNEY_DIALOG.USER_IDS_LABEL}
          value={userIds}
          onChange={handleUserIdsChange}
          error={!!errors.userIds}
          helperText={errors.userIds || JOURNEY_TEXT.TEST_JOURNEY_DIALOG.USER_IDS_HELPER_TEXT}
          required
          fullWidth
          sx={{ mb: 2 }}
          multiline
          rows={2}
        />
        <TextField
          label={JOURNEY_TEXT.TEST_JOURNEY_DIALOG.EXPIRATION_TIME_LABEL}
          type="number"
          value={expireInMins}
          onChange={handleExpireInMinsChange}
          error={!!errors.expireInMins}
          helperText={
            errors.expireInMins ||
            JOURNEY_TEXT.TEST_JOURNEY_DIALOG.EXPIRATION_TIME_HELPER_TEXT
          }
          required
          fullWidth
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          {JOURNEY_TEXT.ACTIONS.CANCEL}
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading}
          autoFocus
        >
          {isLoading
            ? JOURNEY_TEXT.ACTIONS.CREATING
            : existingUserIds
            ? JOURNEY_TEXT.ACTIONS.UPDATE_TEST_JOURNEY
            : JOURNEY_TEXT.ACTIONS.CREATE_TEST_JOURNEY}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

