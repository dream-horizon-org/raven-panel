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
import { useState, useEffect } from "react";

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
  existingExpireInMins = 30,
}: TestFeatureDialogProps) {
  const [userIds, setUserIds] = useState("");
  const [expireInMins, setExpireInMins] = useState("30");
  const [errors, setErrors] = useState<{
    userIds?: string;
    expireInMins?: string;
  }>({});

  // Load existing values when dialog opens
  useEffect(() => {
    if (open) {
      setUserIds(existingUserIds || "");
      setExpireInMins(existingExpireInMins ? String(existingExpireInMins) : "30");
      setErrors({});
    }
  }, [open, existingUserIds, existingExpireInMins]);

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!userIds.trim()) {
      newErrors.userIds = "User IDs are required";
    } else {
      // Validate that all IDs are numbers (comma-separated)
      const idArray = userIds.split(',').map(id => id.trim()).filter(Boolean);
      if (idArray.length === 0) {
        newErrors.userIds = "At least one user ID is required";
      } else {
        const invalidIds = idArray.filter(id => !/^\d+$/.test(id));
        if (invalidIds.length > 0) {
          newErrors.userIds = `Invalid user IDs: ${invalidIds.join(', ')}`;
        }
      }
    }

    const expireInMinsNum = parseInt(expireInMins, 10);
    if (!expireInMins || isNaN(expireInMinsNum) || expireInMinsNum <= 0) {
      newErrors.expireInMins = "Expiration time must be a positive number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(userIds.trim(), expireInMinsNum);
  };

  const handleClose = () => {
    setUserIds("");
    setExpireInMins("30");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="test-journey-dialog-title"
      aria-describedby="test-journey-dialog-description"
    >
      <DialogTitle id="test-journey-dialog-title">Test Journey</DialogTitle>
      <DialogContent>
        <DialogContentText id="test-journey-dialog-description" sx={{ mb: 2 }}>
          Enter the user IDs and expiration time to create a test journey. The journey
          will only be visible to the specified users and will expire automatically.
        </DialogContentText>
        <TextField
          label="User IDs"
          value={userIds}
          onChange={(e) => {
            setUserIds(e.target.value);
            if (errors.userIds) {
              setErrors({ ...errors, userIds: undefined });
            }
          }}
          error={!!errors.userIds}
          helperText={errors.userIds || "Enter comma-separated user IDs (e.g., 123, 456, 789)"}
          required
          fullWidth
          sx={{ mb: 2 }}
          multiline
          rows={2}
        />
        <TextField
          label="Expiration Time (minutes)"
          type="number"
          value={expireInMins}
          onChange={(e) => {
            setExpireInMins(e.target.value);
            if (errors.expireInMins) {
              setErrors({ ...errors, expireInMins: undefined });
            }
          }}
          error={!!errors.expireInMins}
          helperText={
            errors.expireInMins ||
            "Journey will be active for this duration (default: 30 minutes)"
          }
          required
          fullWidth
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading}
          autoFocus
        >
          {isLoading ? "Creating..." : existingUserIds ? "Update Test Journey" : "Create Test Journey"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

