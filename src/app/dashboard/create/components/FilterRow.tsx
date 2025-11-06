"use client";

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo } from "react";
import { filterRowStyles } from "../styles/filterRowStyles";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { OPERATORS, JOURNEY_TEXT } from "../constants/journeyConstants";

interface FilterRowProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  index: number;
  onRemove: () => void;
  availableProperties: string[];
  isLoadingFilters: boolean;
}

export default function FilterRow({
  control,
  errors,
  index,
  onRemove,
  availableProperties,
  isLoadingFilters,
}: FilterRowProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = useMemo(() => {
    if (!availableProperties || availableProperties.length === 0) return [];
    const filtered = availableProperties.filter((prop) =>
      prop.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return searchTerm ? filtered : filtered.slice(0, 10);
  }, [availableProperties, searchTerm]);

  return (
    <Box sx={filterRowStyles.filterCard(theme)}>
      <Box sx={filterRowStyles.filterFields}>
        <Controller
          name={`filters.${index}.property`}
          control={control}
          rules={{ required: JOURNEY_TEXT.VALIDATION.PROPERTY_REQUIRED }}
          render={({ field }: { field: FieldValues }) => (
            <Autocomplete
              options={filteredProperties}
              getOptionLabel={(option) => option || ""}
              loading={isLoadingFilters}
              disabled={isLoadingFilters}
              onInputChange={(_, newInputValue) => {
                setSearchTerm(newInputValue);
              }}
              onChange={(_, newValue) => {
                field.onChange(newValue || "");
              }}
              value={field.value || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={JOURNEY_TEXT.FILTERS.PROPERTY}
                  error={!!errors.filters?.[index]?.property}
                  helperText={errors.filters?.[index]?.property?.message}
                  size="small"
                  sx={filterRowStyles.filterField}
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: "300px",
                },
              }}
              noOptionsText={
                isLoadingFilters
                  ? "Loading properties..."
                  : searchTerm
                  ? "No properties found"
                  : "No properties available"
              }
              sx={filterRowStyles.filterField}
            />
          )}
        />

        <Controller
          name={`filters.${index}.operator`}
          control={control}
          render={({ field }: { field: FieldValues }) => (
            <FormControl
              fullWidth
              sx={filterRowStyles.filterField}
              size="small"
            >
              <InputLabel>{JOURNEY_TEXT.FILTERS.OPERATOR}</InputLabel>
              <Select {...field} label={JOURNEY_TEXT.FILTERS.OPERATOR}>
                {OPERATORS.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name={`filters.${index}.value`}
          control={control}
          rules={{ required: JOURNEY_TEXT.VALIDATION.VALUE_REQUIRED }}
          render={({ field }: { field: FieldValues }) => (
            <TextField
              {...field}
              label={JOURNEY_TEXT.FILTERS.VALUE}
              fullWidth
              error={!!errors.filters?.[index]?.value}
              helperText={errors.filters?.[index]?.value?.message}
              sx={filterRowStyles.filterField}
              size="small"
              placeholder={JOURNEY_TEXT.FILTERS.PLACEHOLDER}
            />
          )}
        />

        <IconButton
          onClick={onRemove}
          sx={filterRowStyles.deleteButton}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
