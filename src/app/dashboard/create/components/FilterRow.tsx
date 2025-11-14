"use client";

import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Autocomplete,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, FieldValues, useWatch, useFormContext } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect, useRef } from "react";
import { filterRowStyles } from "../styles/filterRowStyles";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { OPERATORS, JOURNEY_TEXT } from "../constants/journeyConstants";
import { getInputType, isNumericType, normalizePropertyType } from "../utils/propertyTypeUtils";

interface FilterRowProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  index: number;
  onRemove: () => void;
  availableProperties: string[];
  isLoadingFilters: boolean;
  propertyTypeMap: Map<string, string>;
}

export default function FilterRow({
  control,
  errors,
  index,
  onRemove,
  availableProperties,
  isLoadingFilters,
  propertyTypeMap,
}: FilterRowProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const propertyInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const [propertyFieldWidth, setPropertyFieldWidth] = useState(250);
  const [valueFieldWidth, setValueFieldWidth] = useState(250);

  // Get selected property name to determine input type
  const selectedProperty = useWatch({
    control,
    name: `condition.comparisons.${index}.propertyName` as `condition.comparisons.${number}.propertyName`,
  });

  // Get property type from map (source of truth when property is selected)
  const propertyTypeFromMap = selectedProperty
    ? propertyTypeMap.get(selectedProperty) || "string"
    : "string";

  // Use propertyTypeFromMap if we have a selected property (source of truth)
  // Otherwise, use form value as fallback
  const formPropertyType = useWatch({
    control,
    name: `condition.comparisons.${index}.propertyType` as `condition.comparisons.${number}.propertyType`,
  });

  // Determine the actual property type to use for rendering
  // Priority: propertyTypeFromMap (if property selected) > formPropertyType > "string"
  const propertyType = selectedProperty
    ? propertyTypeFromMap
    : formPropertyType || "string";

  // Get input type based on property type
  const inputType = getInputType(propertyType);

  // Get current comparison value to check if conversion is needed
  const currentComparisonValue = useWatch({
    control,
    name: `condition.comparisons.${index}.comparisonValue` as `condition.comparisons.${number}.comparisonValue`,
  });

  // Adjust width based on selected property name
  useEffect(() => {
    if (selectedProperty && propertyInputRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        context.font = "0.875rem Inter, sans-serif";
        const textWidth = context.measureText(selectedProperty).width;
        const minWidth = 250;
        const calculatedWidth = Math.max(minWidth, textWidth + 50);
        setPropertyFieldWidth(Math.min(calculatedWidth, 500));
      }
    } else {
      setPropertyFieldWidth(250);
    }
  }, [selectedProperty]);

  // Adjust width based on comparison value
  useEffect(() => {
    if (currentComparisonValue && valueInputRef.current) {
      const valueStr = String(currentComparisonValue);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        context.font = "0.875rem Inter, sans-serif";
        const textWidth = context.measureText(valueStr).width;
        const minWidth = 250;
        const calculatedWidth = Math.max(minWidth, textWidth + 50);
        setValueFieldWidth(Math.min(calculatedWidth, 500));
      }
    } else {
      setValueFieldWidth(250);
    }
  }, [currentComparisonValue]);

  // Update propertyType when propertyName changes and convert value if needed
  useEffect(() => {
    if (selectedProperty && propertyTypeFromMap) {
      // Normalize the property type before storing in form
      const normalizedType = normalizePropertyType(propertyTypeFromMap);
      // Always set the propertyType from the map when property changes
      // This ensures the correct type is stored in the form
      setValue(
        `condition.comparisons.${index}.propertyType` as `condition.comparisons.${number}.propertyType`,
        normalizedType,
        {
          shouldValidate: false,
        }
      );

      // Convert existing comparisonValue to number if property type is numeric
      if (isNumericType(propertyTypeFromMap) && currentComparisonValue) {
        const numValue = parseFloat(String(currentComparisonValue));
        if (!isNaN(numValue)) {
          setValue(
            `condition.comparisons.${index}.comparisonValue` as `condition.comparisons.${number}.comparisonValue`,
            numValue,
            {
              shouldValidate: false,
            }
          );
        }
      }
    }
  }, [
    selectedProperty,
    propertyTypeFromMap,
    index,
    setValue,
    currentComparisonValue,
  ]);

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
          name={`condition.comparisons.${index}.propertyName` as `condition.comparisons.${number}.propertyName`}
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
                  inputRef={propertyInputRef}
                  placeholder={JOURNEY_TEXT.FILTERS.PROPERTY}
                  error={
                    !!errors.condition?.comparisons?.[index]?.propertyName
                  }
                  helperText={
                    errors.condition?.comparisons?.[index]?.propertyName?.message
                  }
                  sx={{
                    ...filterRowStyles.filterField,
                    width: `${propertyFieldWidth}px`,
                  }}
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
              sx={{
                ...filterRowStyles.filterField,
                width: `${propertyFieldWidth}px`,
              }}
            />
          )}
        />

        <Controller
          name={`condition.comparisons.${index}.comparisonType` as `condition.comparisons.${number}.comparisonType`}
          control={control}
          render={({ field }: { field: FieldValues }) => (
            <FormControl
              sx={{
                ...filterRowStyles.filterField,
                width: "80px",
                minWidth: "80px",
              }}
            >
              <Select
                {...field}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)" }}>
                        {JOURNEY_TEXT.FILTERS.OPERATOR}
                      </span>
                    );
                  }
                  return OPERATORS.find((op) => op.value === selected)?.label || (selected as string);
                }}
              >
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
          name={`condition.comparisons.${index}.comparisonValue` as `condition.comparisons.${number}.comparisonValue`}
          control={control}
          rules={{ required: JOURNEY_TEXT.VALIDATION.VALUE_REQUIRED }}
          render={({ field }: { field: FieldValues }) => {
            if (inputType === "select") {
              return (
                <FormControl
                  error={
                    !!errors.condition?.comparisons?.[index]?.comparisonValue
                  }
                  sx={{
                    ...filterRowStyles.filterField,
                    width: `${valueFieldWidth}px`,
                  }}
                >
                  <Select
                    {...field}
                    displayEmpty
                    value={field.value || ""}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)" }}>
                            {JOURNEY_TEXT.FILTERS.VALUE}
                          </span>
                        );
                      }
                      return selected === "true" ? "True" : "False";
                    }}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                  {errors.condition?.comparisons?.[index]?.comparisonValue && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.75 }}
                    >
                      {
                        errors.condition?.comparisons?.[index]
                          ?.comparisonValue?.message
                      }
                    </Typography>
                  )}
                </FormControl>
              );
            }

            // Render number or text input
            const isNumeric = isNumericType(propertyType);
            return (
              <TextField
                {...field}
                inputRef={valueInputRef}
                type={inputType}
                placeholder={JOURNEY_TEXT.FILTERS.VALUE}
                error={
                  !!errors.condition?.comparisons?.[index]?.comparisonValue
                }
                helperText={
                  errors.condition?.comparisons?.[index]?.comparisonValue
                    ?.message
                }
                sx={{
                  ...filterRowStyles.filterField,
                  width: `${valueFieldWidth}px`,
                }}
                value={
                  isNumeric && typeof field.value === "number"
                    ? field.value
                    : field.value || ""
                }
                onChange={(e) => {
                  if (isNumeric) {
                    const numValue = parseFloat(e.target.value);

                    field.onChange(
                      e.target.value === "" || isNaN(numValue) ? "" : numValue
                    );
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                inputProps={
                  inputType === "number"
                    ? {
                        step: "any",
                      }
                    : {}
                }
              />
            );
          }}
        />

        {index > 0 && (
          <IconButton
            onClick={onRemove}
            sx={filterRowStyles.deleteButton}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
