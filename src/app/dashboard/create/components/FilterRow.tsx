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
import {
  Controller,
  FieldValues,
  useWatch,
  useFormContext,
  Path,
} from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect, useRef } from "react";
import { filterRowStyles } from "./content/styles/filterRowStyles";
import { CreateJourneyFormData } from "../types/journey.interface";
import { OPERATORS, JOURNEY_TEXT } from "../constants/journeyConstants";
import {
  getInputType,
  isNumericType,
  normalizePropertyType,
} from "../utils/propertyType.utils";

interface FilterRowProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  index: number;
  onRemove: () => void;
  availableProperties: string[];
  isLoadingFilters: boolean;
  propertyTypeMap: Map<string, string>;
  filterPath: string;
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
  const propertyInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const [propertyFieldWidth, setPropertyFieldWidth] = useState(250);
  const [valueFieldWidth, setValueFieldWidth] = useState(250);

  const selectedPropertyObj = useWatch({
    control,
    name: `${filterPath}.filter.${index}.propertyName` as Path<
      CreateJourneyFormData
    >,
  }) as { label: string; isLocal: boolean } | undefined;
  const selectedProperty = selectedPropertyObj?.label || "";

  const propertyTypeFromMap = selectedProperty
    ? propertyTypeMap.get(selectedProperty) || "string"
    : "string";

  const formPropertyType = useWatch({
    control,
    name: `${filterPath}.filter.${index}.propertyType` as Path<
      CreateJourneyFormData
    >,
  }) as string | undefined;

  const propertyType = selectedProperty
    ? propertyTypeFromMap
    : formPropertyType || "string";

  const inputType = getInputType(propertyType);

  const currentComparisonValue = useWatch({
    control,
    name: `${filterPath}.filter.${index}.comparisonValue` as Path<
      CreateJourneyFormData
    >,
  }) as string | number | boolean | undefined;

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

  useEffect(() => {
    if (selectedProperty && propertyTypeFromMap) {
      const normalizedType = normalizePropertyType(propertyTypeFromMap);

      setValue(
        `${filterPath}.filter.${index}.propertyType` as Path<
          CreateJourneyFormData
        >,
        normalizedType,
        {
          shouldValidate: false,
        }
      );

      if (isNumericType(propertyTypeFromMap) && currentComparisonValue) {
        const numValue = parseFloat(String(currentComparisonValue));
        if (!isNaN(numValue)) {
          setValue(
            `${filterPath}.filter.${index}.comparisonValue` as Path<
              CreateJourneyFormData
            >,
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
    filterPath,
  ]);

  const filteredProperties = useMemo(() => {
    if (!availableProperties || availableProperties.length === 0) return [];
    const filtered = availableProperties.filter((prop) =>
      prop.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return searchTerm ? filtered : filtered.slice(0, 10);
  }, [availableProperties, searchTerm]);

  const getFilterError = (
    field: "propertyName" | "comparisonValue"
  ): string | undefined => {
    const errorPath =
      errors.ruleEngine?.eventInfo?.[0]?.currentState?.[0]?.nextState?.[0]
        ?.filters?.filter?.[index];
    if (!errorPath) return undefined;
    const fieldError = (errorPath as {
      propertyName?: { message?: string };
      comparisonValue?: { message?: string };
    })[field];
    return fieldError?.message;
  };

  const hasFilterError = (
    field: "propertyName" | "comparisonValue"
  ): boolean => {
    const errorPath =
      errors.ruleEngine?.eventInfo?.[0]?.currentState?.[0]?.nextState?.[0]
        ?.filters?.filter?.[index];
    if (!errorPath) return false;
    const fieldError = (errorPath as {
      propertyName?: unknown;
      comparisonValue?: unknown;
    })[field];
    return !!fieldError;
  };

  return (
    <Box sx={filterRowStyles.filterCard(theme)}>
      <Box sx={filterRowStyles.filterFields}>
        <Controller
          name={
            `${filterPath}.filter.${index}.propertyName` as Path<
              CreateJourneyFormData
            >
          }
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
                  inputRef={propertyInputRef}
                  placeholder={JOURNEY_TEXT.FILTERS.PROPERTY}
                  error={hasFilterError("propertyName")}
                  helperText={getFilterError("propertyName")}
                  size="small"
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
          name={
            `${filterPath}.filter.${index}.comparisonType` as Path<
              CreateJourneyFormData
            >
          }
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
                      <span
                        style={{
                          color:
                            theme.palette.mode === "light"
                              ? "rgba(0, 0, 0, 0.6)"
                              : "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {JOURNEY_TEXT.FILTERS.OPERATOR}
                      </span>
                    );
                  }
                  return (
                    OPERATORS.find((op) => op.value === selected)?.label ||
                    (selected as string)
                  );
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
          name={
            `${filterPath}.filter.${index}.comparisonValue` as Path<
              CreateJourneyFormData
            >
          }
          control={control}
          rules={{ required: JOURNEY_TEXT.VALIDATION.VALUE_REQUIRED }}
          render={({ field }: { field: FieldValues }) => {
            if (inputType === "select") {
              return (
                <FormControl
                  error={hasFilterError("comparisonValue")}
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
                          <span
                            style={{
                              color:
                                theme.palette.mode === "light"
                                  ? "rgba(0, 0, 0, 0.6)"
                                  : "rgba(255, 255, 255, 0.6)",
                            }}
                          >
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
                  {hasFilterError("comparisonValue") && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.75 }}
                    >
                      {getFilterError("comparisonValue")}
                    </Typography>
                  )}
                </FormControl>
              );
            }

            const isNumeric = isNumericType(propertyType);
            return (
              <TextField
                {...field}
                inputRef={valueInputRef}
                type={inputType}
                placeholder={JOURNEY_TEXT.FILTERS.VALUE}
                error={hasFilterError("comparisonValue")}
                helperText={getFilterError("comparisonValue")}
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
