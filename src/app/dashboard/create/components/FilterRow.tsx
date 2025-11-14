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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, FieldValues, useWatch, useFormContext, Path } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect } from "react";
import { filterRowStyles } from "../styles/filterRowStyles";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { OPERATORS, JOURNEY_TEXT } from "../constants/journeyConstants";
import { getInputType, isNumericType, normalizePropertyType } from "../utils/propertyTypeUtils";

// Helper type for accessing nested filter errors
type FilterErrorPath = `ruleEngine.eventInfo.${number}.currentState.${number}.nextState.${number}.filters.filter.${number}`;

interface FilterRowProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  index: number;
  onRemove: () => void;
  availableProperties: string[];
  isLoadingFilters: boolean;
  propertyTypeMap: Map<string, string>;
  filterPath: string; // Path to the filters array
}

export default function FilterRow({
  control,
  errors,
  index,
  onRemove,
  availableProperties,
  isLoadingFilters,
  propertyTypeMap,
  filterPath,
}: FilterRowProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Get selected property name to determine input type
  const selectedPropertyObj = useWatch({
    control,
    name: `${filterPath}.filter.${index}.propertyName` as Path<CreateJourneyFormData>,
  }) as { label: string; isLocal: boolean } | undefined;
  const selectedProperty = selectedPropertyObj?.label || "";

  // Get property type from map (source of truth when property is selected)
  const propertyTypeFromMap = selectedProperty
    ? propertyTypeMap.get(selectedProperty) || "string"
    : "string";

  // Use propertyTypeFromMap if we have a selected property (source of truth)
  // Otherwise, use form value as fallback
  const formPropertyType = useWatch({
    control,
    name: `${filterPath}.filter.${index}.propertyType` as Path<CreateJourneyFormData>,
  }) as string | undefined;

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
    name: `${filterPath}.filter.${index}.comparisonValue` as Path<CreateJourneyFormData>,
  }) as string | number | boolean | undefined;

  // Update propertyType when propertyName changes and convert value if needed
  useEffect(() => {
    if (selectedProperty && propertyTypeFromMap) {
      // Normalize the property type before storing in form
      const normalizedType = normalizePropertyType(propertyTypeFromMap);
      // Always set the propertyType from the map when property changes
      // This ensures the correct type is stored in the form
      setValue(
        `${filterPath}.filter.${index}.propertyType` as Path<CreateJourneyFormData>,
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
            `${filterPath}.filter.${index}.comparisonValue` as Path<CreateJourneyFormData>,
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

  // Helper function to safely access nested filter errors
  const getFilterError = (field: 'propertyName' | 'comparisonValue'): string | undefined => {
    const errorPath = errors.ruleEngine?.eventInfo?.[0]?.currentState?.[0]?.nextState?.[0]?.filters?.filter?.[index];
    if (!errorPath) return undefined;
    const fieldError = (errorPath as { propertyName?: { message?: string }; comparisonValue?: { message?: string } })[field];
    return fieldError?.message;
  };

  const hasFilterError = (field: 'propertyName' | 'comparisonValue'): boolean => {
    const errorPath = errors.ruleEngine?.eventInfo?.[0]?.currentState?.[0]?.nextState?.[0]?.filters?.filter?.[index];
    if (!errorPath) return false;
    const fieldError = (errorPath as { propertyName?: unknown; comparisonValue?: unknown })[field];
    return !!fieldError;
  };

  return (
    <Box sx={filterRowStyles.filterCard(theme)}>
      <Box sx={filterRowStyles.filterFields}>
        <Controller
          name={`${filterPath}.filter.${index}.propertyName` as Path<CreateJourneyFormData>}
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
                field.onChange({
                  label: newValue || "",
                  isLocal: false,
                });
              }}
              value={field.value?.label || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={JOURNEY_TEXT.FILTERS.PROPERTY}
                  error={hasFilterError('propertyName')}
                  helperText={getFilterError('propertyName')}
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
          name={`${filterPath}.filter.${index}.comparisonType` as Path<CreateJourneyFormData>}
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
          name={`${filterPath}.filter.${index}.comparisonValue` as Path<CreateJourneyFormData>}
          control={control}
          rules={{ required: JOURNEY_TEXT.VALIDATION.VALUE_REQUIRED }}
          render={({ field }: { field: FieldValues }) => {
            if (inputType === "select") {
              return (
                <FormControl
                  fullWidth
                  error={hasFilterError('comparisonValue')}
                  sx={filterRowStyles.filterField}
                  size="small"
                >
                  <InputLabel>{JOURNEY_TEXT.FILTERS.VALUE}</InputLabel>
                  <Select
                    {...field}
                    label={JOURNEY_TEXT.FILTERS.VALUE}
                    value={field.value || ""}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                  {hasFilterError('comparisonValue') && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.75 }}
                    >
                      {getFilterError('comparisonValue')}
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
                type={inputType}
                label={JOURNEY_TEXT.FILTERS.VALUE}
                fullWidth
                error={hasFilterError('comparisonValue')}
                helperText={getFilterError('comparisonValue')}
                sx={filterRowStyles.filterField}
                size="small"
                placeholder={JOURNEY_TEXT.FILTERS.PLACEHOLDER}
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
