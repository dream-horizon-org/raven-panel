"use client";

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  ReactNativeJson,
  NudgeType,
  ClickActionDefinition,
} from "../../types/journey.interface";

import { contentElementEditorStyles } from "./styles/contentElementEditorStyles";
import { useFormContext } from "react-hook-form";
import { CreateJourneyFormData } from "../../types/journey.interface";
import FormHelperText from "@mui/material/FormHelperText";
import {
  getAllClickActions,
  getAvailableActions,
  getClickActionDefinition,
} from "../../utils/componentDefinitions.utils";
import { useEventsList } from "../../hooks/useEventsList";
import { useSystemProperties } from "../../hooks/useSystemProperties";
import { extractSystemProperties } from "../../utils/propertyType.utils";
import { getAvailableProperties } from "../../utils/engagement.utils";

interface ElementActionsEditorProps {
  element: ReactNativeJson;
  componentType: string;
  onActionsChange: (actions: ReactNativeJson["actions"]) => void;
  engagementType?: NudgeType;
  basePath?: string;
}

interface EventParam {
  name: string;
  type: "string" | "boolean" | "number";
  value?: string | number | boolean;
}

export default function ElementActionsEditor({
  element,
  componentType,
  onActionsChange,
  engagementType,
  basePath = "nudgeSelection.actions.0.template",
}: ElementActionsEditorProps) {
  const {
    formState: { errors },
  } = useFormContext<CreateJourneyFormData>();

  const { data: eventsData } = useEventsList();
  const eventNames =
    eventsData?.data?.eventList
      ?.map((event) => event.metadata?.eventName)
      .filter((name): name is string => Boolean(name)) || [];

  const { data: systemPropertiesData } = useSystemProperties();
  const { systemPropertyNames, systemPropertyTypes } = extractSystemProperties(
    systemPropertiesData
  );

  // Helper function to get property type from property name
  const getPropertyType = (
    propertyName: string,
    actionParams: { eventName?: string }
  ): "string" | "boolean" | "number" => {
    if (!propertyName) return "string";

    // First check event properties if eventName is set
    if (actionParams.eventName && eventsData?.data?.eventList) {
      const selectedEvent = eventsData.data.eventList.find(
        (event) => event.metadata?.eventName === actionParams.eventName
      );
      if (selectedEvent?.properties) {
        const eventProp = selectedEvent.properties.find(
          (prop) => prop.propertyName === propertyName
        );
        if (eventProp?.type) {
          // Normalize the type
          const normalizedType = eventProp.type.toLowerCase();
          if (normalizedType === "boolean") return "boolean";
          if (
            ["integer", "long", "double", "decimal", "float"].includes(
              normalizedType
            )
          ) {
            return "number";
          }
          return "string";
        }
      }
    }

    // Check system properties
    const systemType = systemPropertyTypes.get(propertyName);
    if (systemType) {
      const normalizedType = systemType.toLowerCase();
      if (normalizedType === "boolean") return "boolean";
      if (
        ["integer", "long", "double", "decimal", "float"].includes(
          normalizedType
        )
      ) {
        return "number";
      }
      return "string";
    }

    return "string";
  };

  const getFieldError = (actionIndex: number, paramName: string) => {
    if (!basePath) return undefined;
    const fieldPath = `${basePath}.actions.${actionIndex}.params.${paramName}`;

    const pathParts = fieldPath.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      if (!current || typeof current !== "object") {
        return undefined;
      }
      const numericIndex = parseInt(part, 10);
      const isNumericKey =
        !isNaN(numericIndex) && part === String(numericIndex);

      if (isNumericKey) {
        if (part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      } else {
        if (part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
    }

    if (current && typeof current === "object" && "message" in current) {
      return current;
    }

    return undefined;
  };

  const availableActionNames = getAvailableActions(componentType);
  const allClickActions = getAllClickActions();
  const elementActions = element.actions || [];

  const enabledActions = elementActions.filter(
    (action) =>
      typeof action === "object" &&
      "name" in action &&
      availableActionNames.includes(action.name)
  );

  const handleToggleAction = (actionName: string, enabled: boolean) => {
    let newActions = [...elementActions];

    if (enabled) {
      // Add action if not present
      const actionDef = getClickActionDefinition(actionName);
      if (actionDef) {
        if (actionDef.category === "toggle") {
          // For toggle actions, just add the action
          if (actionName === "analyticsEvent") {
            newActions.push({
              name: "analyticsEvent",
              type: "analyticsEvent",
              params: {
                eventName: "",
                eventParams: [],
              },
            });
          } else {
            const newAction = {
              name: actionName,
              type: actionDef.type,
              params: {},
            };
            newActions.push(newAction);
          }
        } else {
          // For dropdown actions, add with default params
          const defaultParams: Record<
            string,
            string | number | boolean | null | undefined
          > = {};
          actionDef.params?.forEach((param) => {
            if (param.default !== null && param.default !== undefined) {
              defaultParams[param.name] = param.default;
            }
          });
          newActions.push({
            name: actionName,
            type: actionDef.type,
            params: defaultParams,
          });
        }
      }
    } else {
      // Remove action
      newActions = newActions.filter(
        (action) =>
          typeof action === "object" &&
          "name" in action &&
          action.name !== actionName
      );
    }

    onActionsChange(newActions);
  };

  const handleActionParamChange = (
    actionName: string,
    paramName: string,
    value: string | number | boolean | null | undefined
  ) => {
    const newActions = elementActions.map((action) => {
      if (
        typeof action === "object" &&
        "name" in action &&
        action.name === actionName
      ) {
        if (actionName === "analyticsEvent" && paramName === "eventName") {
          // For analyticsEvent eventName, update NudgeEvent structure
          const currentParams = action.params as {
            eventName?: string;
            eventParams?: EventParam[];
          };
          return {
            ...action,
            type: "analyticsEvent",
            name: "analyticsEvent",
            params: {
              eventName: value,
              eventParams: currentParams?.eventParams || [],
            },
          };
        } else {
          return {
            ...action,
            params: {
              ...(action.params || {}),
              [paramName]: value,
            },
          };
        }
      }
      return action;
    });
    onActionsChange(newActions);
  };

  const handleEventParamsChange = (
    actionName: string,
    eventParams: EventParam[]
  ) => {
    const newActions = elementActions.map((action) => {
      if (
        typeof action === "object" &&
        "name" in action &&
        action.name === actionName
      ) {
        if (
          actionName === "analyticsEvent" ||
          actionName === "emitNativeEvent"
        ) {
          const currentParams = action.params as {
            eventName?: string;
            eventParams?: EventParam[];
          };
          const transformedEventParams = eventParams.map((param) => {
            // Convert primitive value to array format if it exists
            if (
              param.value !== undefined &&
              param.value !== null &&
              param.value !== ""
            ) {
              let convertedValue: string | number | boolean = param.value;

              if (
                actionName === "emitNativeEvent" &&
                param.type === "boolean"
              ) {
                convertedValue =
                  typeof param.value === "string"
                    ? param.value
                    : String(param.value);
              } else if (param.type === "boolean") {
                if (typeof param.value === "string") {
                  const lowerValue = param.value.toLowerCase().trim();
                  convertedValue = lowerValue === "true";
                } else {
                  convertedValue = Boolean(param.value);
                }
              } else if (param.type === "number") {
                if (typeof param.value === "string") {
                  convertedValue = Number(param.value) || 0;
                } else {
                  convertedValue = Number(param.value);
                }
              } else {
                convertedValue = String(param.value);
              }

              return {
                name: param.name,
                type: param.type,
                value: [
                  {
                    value: convertedValue,
                    isTemplateString: false,
                  },
                ],
              };
            }
            return {
              name: param.name,
              type: param.type,
            };
          });
          return {
            ...action,
            type: actionName,
            name: actionName,
            params: {
              eventName: currentParams?.eventName || "",
              eventParams: transformedEventParams,
            },
          };
        } else {
          return {
            ...action,
            params: {
              ...(action.params || {}),
              eventParams,
            },
          };
        }
      }
      return action;
    });
    onActionsChange(newActions);
  };

  const isActionEnabled = (actionName: string): boolean => {
    return enabledActions.some(
      (action) =>
        typeof action === "object" &&
        "name" in action &&
        action.name === actionName
    );
  };

  const getActionParams = (
    actionName: string
  ): Record<
    string,
    string | number | boolean | EventParam[] | null | undefined
  > => {
    const action = enabledActions.find(
      (a) => typeof a === "object" && "name" in a && a.name === actionName
    );
    if (action && typeof action === "object" && "params" in action) {
      if (actionName === "analyticsEvent") {
        // For analyticsEvent, return params with eventParams array
        const params = action.params as {
          eventName?: string;
          eventParams?: EventParam[];
        };
        return {
          eventName: params?.eventName || "",
          eventParams: params?.eventParams || [],
        };
      }
      return action.params as Record<
        string,
        string | number | boolean | null | undefined
      >;
    }
    return {};
  };

  const renderActionParams = (actionDef: ClickActionDefinition) => {
    if (!actionDef.params || actionDef.params.length === 0) {
      return null;
    }

    const params = getActionParams(actionDef.name);

    const actionIndex = elementActions.findIndex(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (action: any) =>
        typeof action === "object" &&
        "name" in action &&
        action.name === actionDef.name
    );

    return (
      <Box
        sx={{
          ml: 3,
          mt: 1,
          mb: 2,
          pl: 2,
          borderLeft: 2,
          borderColor: "divider",
        }}
      >
        {actionDef.params.map((param) => {
          if (param.type === "dynamicArray") {
            // Handle eventParams for analytics and emitNativeEvent
            // For analyticsEvent and emitNativeEvent, eventParams is directly in params.eventParams
            let eventParams: EventParam[] = [];
            let availableProperties: string[] = [];
            if (
              actionDef.name === "analyticsEvent" ||
              actionDef.name === "emitNativeEvent"
            ) {
              const rawEventParams = Array.isArray(params.eventParams)
                ? params.eventParams
                : [];
              // Convert from API format (array value) to display format (primitive value)
              eventParams = rawEventParams.map((param: any) => {
                let displayValue: string | number | boolean | undefined;
                // If value is an array (API format), extract the actual value
                if (Array.isArray(param.value) && param.value.length > 0) {
                  const firstItem = param.value[0];
                  if (
                    typeof firstItem === "object" &&
                    firstItem !== null &&
                    "value" in firstItem &&
                    !firstItem.isTemplateString
                  ) {
                    displayValue = firstItem.value;
                  }
                } else if (
                  param.value !== undefined &&
                  param.value !== null &&
                  (typeof param.value === "string" ||
                    typeof param.value === "number" ||
                    typeof param.value === "boolean")
                ) {
                  // Already in primitive format (from transform function)
                  displayValue = param.value;
                }
                return {
                  name: param.name || "",
                  type: param.type || "string",
                  value: displayValue,
                };
              });
              // Get available properties (event + system properties) for the selected event
              // Only for analyticsEvent, emitNativeEvent doesn't need event-based properties
              if (actionDef.name === "analyticsEvent") {
                availableProperties = getAvailableProperties({
                  eventName: params.eventName as string,
                  eventsData: eventsData ?? { data: { eventList: [] } },
                  systemPropertyNames,
                });
              } else {
                // For emitNativeEvent, only use system properties
                availableProperties = [...systemPropertyNames].sort();
              }
            } else {
              const paramValue = params[param.name];
              eventParams = Array.isArray(paramValue) ? paramValue : [];
            }
            return (
              <Box key={param.name} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {param.name}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      const newParams = [
                        ...eventParams,
                        { name: "", type: "string" as const },
                      ];
                      handleEventParamsChange(actionDef.name, newParams);
                    }}
                  >
                    Add Property
                  </Button>
                </Box>
                {eventParams.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    No event property added
                  </Typography>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {eventParams.map(
                      (eventParam: EventParam, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            p: 1,
                            bgcolor: "background.default",
                            borderRadius: 1,
                          }}
                        >
                          {actionDef.name === "emitNativeEvent" ? (
                            <TextField
                              size="small"
                              label="Property"
                              value={eventParam.name || ""}
                              onChange={(e) => {
                                const newParams = [...eventParams];
                                newParams[index] = {
                                  ...eventParam,
                                  name: e.target.value,
                                  type: eventParam.type || "string",
                                };
                                handleEventParamsChange(
                                  actionDef.name,
                                  newParams
                                );
                              }}
                              sx={{ flex: 1 }}
                            />
                          ) : (
                            <Autocomplete
                              freeSolo
                              options={availableProperties}
                              value={eventParam.name || ""}
                              onChange={(_, newValue) => {
                                const newParams = [...eventParams];
                                const propertyName = newValue || "";
                                // Infer type from property name for analyticsEvent
                                const inferredType = getPropertyType(
                                  propertyName,
                                  params as { eventName?: string }
                                );
                                newParams[index] = {
                                  ...eventParam,
                                  name: propertyName,
                                  type: inferredType,
                                };
                                handleEventParamsChange(
                                  actionDef.name,
                                  newParams
                                );
                              }}
                              onInputChange={(_, newInputValue) => {
                                const newParams = [...eventParams];
                                const propertyName = newInputValue;

                                const inferredType = getPropertyType(
                                  propertyName,
                                  params as { eventName?: string }
                                );
                                newParams[index] = {
                                  ...eventParam,
                                  name: propertyName,
                                  type: inferredType,
                                };
                                handleEventParamsChange(
                                  actionDef.name,
                                  newParams
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  label="Property"
                                />
                              )}
                              sx={{ flex: 1 }}
                            />
                          )}
                          {actionDef.name === "emitNativeEvent" ? (
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                              <InputLabel>Type</InputLabel>
                              <Select
                                value={eventParam.type || "string"}
                                label="Type"
                                onChange={(e) => {
                                  const newParams = [...eventParams];
                                  const newType = e.target.value as
                                    | "string"
                                    | "boolean"
                                    | "number";

                                  let convertedValue:
                                    | string
                                    | number
                                    | boolean
                                    | undefined = eventParam.value;
                                  if (
                                    convertedValue !== undefined &&
                                    convertedValue !== null &&
                                    convertedValue !== ""
                                  ) {
                                    if (newType === "boolean") {
                                      if (
                                        actionDef.name === "emitNativeEvent"
                                      ) {
                                        convertedValue =
                                          typeof convertedValue === "boolean"
                                            ? String(convertedValue)
                                            : String(convertedValue).trim();
                                      } else {
                                        if (
                                          typeof convertedValue === "string"
                                        ) {
                                          const lowerValue = convertedValue
                                            .toLowerCase()
                                            .trim();
                                          convertedValue =
                                            lowerValue === "true";
                                        } else {
                                          convertedValue = Boolean(
                                            convertedValue
                                          );
                                        }
                                      }
                                    } else if (newType === "number") {
                                      if (typeof convertedValue === "string") {
                                        convertedValue =
                                          Number(convertedValue) || 0;
                                      } else {
                                        convertedValue = Number(convertedValue);
                                      }
                                    } else {
                                      convertedValue = String(convertedValue);
                                    }
                                  } else {
                                    if (newType === "boolean") {
                                      convertedValue = "";
                                    } else {
                                      convertedValue = undefined;
                                    }
                                  }

                                  newParams[index] = {
                                    ...eventParam,
                                    type: newType,
                                    value: convertedValue,
                                  };
                                  handleEventParamsChange(
                                    actionDef.name,
                                    newParams
                                  );
                                }}
                              >
                                <MenuItem value="string">string</MenuItem>
                                <MenuItem value="boolean">boolean</MenuItem>
                                <MenuItem value="number">number</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              size="small"
                              label="Type"
                              value={eventParam.type || "string"}
                              InputProps={{
                                readOnly: true,
                              }}
                              sx={{ minWidth: 100 }}
                            />
                          )}
                          <TextField
                            size="small"
                            label="Value"
                            value={
                              eventParam.value !== undefined &&
                              eventParam.value !== null &&
                              eventParam.value !== ""
                                ? typeof eventParam.value === "boolean"
                                  ? String(eventParam.value)
                                  : String(eventParam.value)
                                : ""
                            }
                            onChange={(e) => {
                              const newParams = [...eventParams];
                              const inputValue = e.target.value;
                              // Convert value to appropriate type based on param.type
                              let convertedValue:
                                | string
                                | number
                                | boolean = inputValue;

                              if (eventParam.type === "number") {
                                convertedValue = Number(inputValue) || 0;
                              } else if (eventParam.type === "boolean") {
                                convertedValue = inputValue;
                              }

                              newParams[index] = {
                                ...eventParam,
                                value: convertedValue,
                              };
                              handleEventParamsChange(
                                actionDef.name,
                                newParams
                              );
                            }}
                            onFocus={(e) => {

                              if (
                                eventParam.type === "boolean" &&
                                typeof eventParam.value === "boolean"
                              ) {
                                const newParams = [...eventParams];
                                newParams[index] = {
                                  ...eventParam,
                                  value: String(eventParam.value), 
                                };
                                handleEventParamsChange(
                                  actionDef.name,
                                  newParams
                                );
                                setTimeout(() => {
                                  e.target.select();
                                }, 0);
                              } else if (
                                eventParam.type === "boolean" &&
                                typeof eventParam.value === "string" &&
                                actionDef.name === "emitNativeEvent"
                              ) {
                                setTimeout(() => {
                                  e.target.select();
                                }, 0);
                              }
                            }}
                            onBlur={() => {
                              if (eventParam.type === "boolean") {
                                const newParams = [...eventParams];
                                const currentValue = eventParam.value;

                                if (
                                  currentValue === undefined ||
                                  currentValue === null ||
                                  currentValue === ""
                                ) {
                                  return;
                                }

                                if (actionDef.name === "emitNativeEvent") {
                                  const normalizedValue = String(
                                    currentValue
                                  ).trim();
                                  if (
                                    normalizedValue !== String(currentValue)
                                  ) {
                                    newParams[index] = {
                                      ...eventParam,
                                      value: normalizedValue,
                                    };
                                    handleEventParamsChange(
                                      actionDef.name,
                                      newParams
                                    );
                                  }
                                  return;
                                }

                                let finalValue: boolean;
                                if (typeof currentValue === "boolean") {
                                  finalValue = currentValue;
                                } else {
                                  const stringValue = String(currentValue)
                                    .toLowerCase()
                                    .trim();
                                  finalValue = stringValue === "true";
                                }

                                newParams[index] = {
                                  ...eventParam,
                                  value: finalValue,
                                };
                                handleEventParamsChange(
                                  actionDef.name,
                                  newParams
                                );
                              }
                            }}
                            sx={{ flex: 1 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              const newParams = eventParams.filter(
                                (_: EventParam, i: number) => i !== index
                              );
                              handleEventParamsChange(
                                actionDef.name,
                                newParams
                              );
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )
                    )}
                  </Box>
                )}
              </Box>
            );
          }

          // For analyticsEvent, eventName is at params.eventName, not params[param.name]
          // Only access non-array values for non-dynamicArray params
          let currentValue: string | number | boolean | null | undefined;
          if (
            actionDef.name === "analyticsEvent" &&
            param.name === "eventName"
          ) {
            currentValue =
              (params.eventName as string | null | undefined) ??
              param.default ??
              "";
          } else {
            const paramValue = params[param.name];
            // Handle deeplink URLs - extract value from array format if needed
            if (actionDef.name === "deeplink" && Array.isArray(paramValue)) {
              if (paramValue.length > 0) {
                const firstItem = paramValue[0];
                if (
                  typeof firstItem === "object" &&
                  firstItem !== null &&
                  "value" in firstItem
                ) {
                  currentValue = firstItem.value as string;
                } else if (typeof firstItem === "string") {
                  currentValue = firstItem;
                } else {
                  currentValue = param.default ?? "";
                }
              } else {
                currentValue = param.default ?? "";
              }
            } else if (Array.isArray(paramValue)) {
              // For other array params (not deeplink), use default
              currentValue = param.default ?? "";
            } else {
              currentValue = paramValue ?? param.default ?? "";
            }
          }

          switch (param.type) {
            case "string":
              // For analyticsEvent eventName, use Autocomplete dropdown with event list
              if (
                actionDef.name === "analyticsEvent" &&
                param.name === "eventName"
              ) {
                const eventNameValue =
                  typeof currentValue === "string"
                    ? currentValue
                    : currentValue !== null && currentValue !== undefined
                    ? String(currentValue)
                    : "";
                return (
                  <Autocomplete
                    key={param.name}
                    freeSolo
                    options={eventNames}
                    value={eventNameValue}
                    onChange={(_, newValue) => {
                      handleActionParamChange(
                        actionDef.name,
                        param.name,
                        newValue || ""
                      );
                    }}
                    onInputChange={(_, newInputValue) => {
                      handleActionParamChange(
                        actionDef.name,
                        param.name,
                        newInputValue
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        label={param.name}
                        required={param.isRequired}
                        sx={{ mb: 2 }}
                      />
                    )}
                    sx={{ mb: 2 }}
                  />
                );
              }
              // Fallback TextField for other string parameters (not eventName)
              return (
                <TextField
                  key={param.name}
                  fullWidth
                  size="small"
                  label={param.name}
                  value={currentValue}
                  onChange={(e) =>
                    handleActionParamChange(
                      actionDef.name,
                      param.name,
                      e.target.value
                    )
                  }
                  required={param.isRequired}
                  sx={{ mb: 2 }}
                />
              );

            case "number":
              return (
                <TextField
                  key={param.name}
                  fullWidth
                  size="small"
                  type="number"
                  label={param.name}
                  value={currentValue}
                  onChange={(e) =>
                    handleActionParamChange(
                      actionDef.name,
                      param.name,
                      Number(e.target.value) || 0
                    )
                  }
                  required={param.isRequired}
                  sx={{ mb: 2 }}
                />
              );

            case "enum":
              return (
                <FormControl
                  key={param.name}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <InputLabel>{param.name}</InputLabel>
                  <Select
                    value={currentValue || param.default || ""}
                    label={param.name}
                    onChange={(e) =>
                      handleActionParamChange(
                        actionDef.name,
                        param.name,
                        e.target.value
                      )
                    }
                  >
                    {param.acceptedValues?.map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );

            case "url":
              const fieldError =
                actionIndex >= 0
                  ? getFieldError(actionIndex, param.name)
                  : undefined;

              return (
                <FormControl
                  key={param.name}
                  fullWidth
                  error={!!fieldError}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    type="url"
                    label={param.name}
                    value={currentValue}
                    onChange={(e) =>
                      handleActionParamChange(
                        actionDef.name,
                        param.name,
                        e.target.value
                      )
                    }
                    required={param.isRequired}
                    placeholder="https://..."
                    error={!!fieldError}
                  />
                  {fieldError && (
                    <FormHelperText>{fieldError.message}</FormHelperText>
                  )}
                </FormControl>
              );

            default:
              return (
                <TextField
                  key={param.name}
                  fullWidth
                  size="small"
                  label={param.name}
                  value={currentValue}
                  onChange={(e) =>
                    handleActionParamChange(
                      actionDef.name,
                      param.name,
                      e.target.value
                    )
                  }
                  required={param.isRequired}
                  sx={{ mb: 2 }}
                />
              );
          }
        })}
      </Box>
    );
  };

  // Get dropdown actions (excluding openPlayStore)
  const dropdownActions = allClickActions.filter(
    (action) =>
      action.category === "dropdown" &&
      action.name !== "openPlayStore" &&
      action.name !== "none" &&
      availableActionNames.includes(action.name)
  );

  // Get currently selected dropdown action
  const selectedDropdownAction = enabledActions.find(
    (action) =>
      typeof action === "object" &&
      "name" in action &&
      dropdownActions.some((da) => da.name === action.name)
  );

  const selectedDropdownActionName = selectedDropdownAction
    ? (selectedDropdownAction as { name: string }).name
    : "none";

  const selectedDropdownActionDef = dropdownActions.find(
    (da) => da.name === selectedDropdownActionName
  );

  return (
    <Box sx={contentElementEditorStyles.section}>
      <Typography sx={contentElementEditorStyles.sectionLabel}>
        CLICK ACTIONS
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Toggle actions */}
        {allClickActions
          .filter(
            (action) =>
              action.category === "toggle" &&
              availableActionNames.includes(action.name)
          )
          .map((actionDef) => {
            const enabled = isActionEnabled(actionDef.name);

            // Get context-aware display label for dismiss action
            const getDisplayLabel = () => {
              if (actionDef.name === "dismiss" && engagementType) {
                // Handle both enum and string values
                const typeStr = String(engagementType).toUpperCase();
                if (
                  engagementType === NudgeType.NUDGE_UI ||
                  typeStr === "NUDGE_UI" ||
                  typeStr === "BOTTOMSHEET"
                ) {
                  return "Dismiss BottomSheet";
                } else if (
                  engagementType === NudgeType.POPUP ||
                  typeStr === "POPUP"
                ) {
                  return "Dismiss Popup";
                } else if (
                  engagementType === NudgeType.TOOLTIP ||
                  typeStr === "TOOLTIP"
                ) {
                  return "Dismiss Tooltip";
                }
              }
              return actionDef.display;
            };

            const displayLabel = getDisplayLabel();

            return (
              <Box key={actionDef.id}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabled}
                      onChange={(e) =>
                        handleToggleAction(actionDef.name, e.target.checked)
                      }
                    />
                  }
                  label={displayLabel}
                />
                {enabled && renderActionParams(actionDef)}
              </Box>
            );
          })}

        {/* Consolidated dropdown for dropdown actions */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Click Action Type</InputLabel>
              <Select
                value={selectedDropdownActionName}
                label="Click Action Type"
                onChange={(e) => {
                  const selectedAction = e.target.value;
                  let newActions = [...elementActions];

                  // Remove all dropdown actions
                  newActions = newActions.filter(
                    (action) =>
                      !(
                        typeof action === "object" &&
                        "name" in action &&
                        dropdownActions.some((da) => da.name === action.name)
                      )
                  );

                  // Add the selected action if not "none"
                  if (selectedAction !== "none") {
                    const actionDef = getClickActionDefinition(selectedAction);
                    if (actionDef) {
                      const defaultParams: Record<
                        string,
                        string | number | boolean | null | undefined
                      > = {};
                      actionDef.params?.forEach((param) => {
                        if (
                          param.default !== null &&
                          param.default !== undefined
                        ) {
                          defaultParams[param.name] = param.default;
                        }
                      });
                      newActions.push({
                        name: selectedAction,
                        type: actionDef.type,
                        params: defaultParams,
                      });
                    }
                  }

                  onActionsChange(newActions);
                }}
              >
                <MenuItem value="none">None</MenuItem>
                {dropdownActions.map((actionDef) => (
                  <MenuItem key={actionDef.id} value={actionDef.name}>
                    {actionDef.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedDropdownActionName !== "none" && (
              <IconButton
                size="small"
                onClick={() => {
                  dropdownActions.forEach((da) => {
                    if (isActionEnabled(da.name)) {
                      handleToggleAction(da.name, false);
                    }
                  });
                }}
                sx={{ color: "text.secondary" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          {selectedDropdownActionDef &&
            isActionEnabled(selectedDropdownActionDef.name) &&
            renderActionParams(selectedDropdownActionDef)}
        </Box>
      </Box>
    </Box>
  );
}
