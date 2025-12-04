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
import { ReactNativeJson, NudgeType } from "../../types/journey.interface";
import {
  getAvailableActions,
  getAllClickActions,
  getClickActionDefinition,
  ClickActionDefinition,
} from "../../utils/componentDefinitions";
import { contentElementEditorStyles } from "./styles/contentElementEditorStyles";
import { useFormContext } from "react-hook-form";
import { CreateJourneyFormData } from "../../types/journey.interface";
import FormHelperText from "@mui/material/FormHelperText";

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
        if (actionName === "analyticsEvent") {
          // For analyticsEvent, params should be NudgeEvent structure
          const currentParams = action.params as {
            eventName?: string;
            eventParams?: EventParam[];
          };
          return {
            ...action,
            type: "analyticsEvent",
            name: "analyticsEvent",
            params: {
              eventName: currentParams?.eventName || "",
              eventParams,
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
            // Handle eventParams for analytics
            // For analyticsEvent, eventParams is directly in params.eventParams
            let eventParams: EventParam[] = [];
            if (actionDef.name === "analyticsEvent") {
              eventParams = Array.isArray(params.eventParams)
                ? params.eventParams
                : [];
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
                          <Autocomplete
                            freeSolo
                            options={[]}
                            value={eventParam.name || ""}
                            onChange={(_, newValue) => {
                              const newParams = [...eventParams];
                              newParams[index] = {
                                ...eventParam,
                                name: newValue || "",
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
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                              value={eventParam.type || "string"}
                              label="Type"
                              onChange={(e) => {
                                const newParams = [...eventParams];
                                newParams[index] = {
                                  ...eventParam,
                                  type: e.target.value as
                                    | "string"
                                    | "boolean"
                                    | "number",
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
                          <TextField
                            size="small"
                            label="Value"
                            value={eventParam.value || ""}
                            onChange={(e) => {
                              const newParams = [...eventParams];
                              newParams[index] = {
                                ...eventParam,
                                value: e.target.value,
                              };
                              handleEventParamsChange(
                                actionDef.name,
                                newParams
                              );
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
            // Ensure we're not getting an array (arrays are handled in dynamicArray case)
            if (Array.isArray(paramValue)) {
              currentValue = param.default ?? "";
            } else {
              currentValue = paramValue ?? param.default ?? "";
            }
          }

          switch (param.type) {
            case "string":
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

  return (
    <Box sx={contentElementEditorStyles.section}>
      <Typography sx={contentElementEditorStyles.sectionLabel}>
        CLICK ACTIONS
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {allClickActions
          .filter((action) => availableActionNames.includes(action.name))
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

            if (actionDef.category === "toggle") {
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
            } else {
              return (
                <Box key={actionDef.id}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{displayLabel}</InputLabel>
                    <Select
                      value={enabled ? actionDef.name : "none"}
                      label={displayLabel}
                      onChange={(e) => {
                        const selectedAction = e.target.value;
                        if (selectedAction === "none") {
                          handleToggleAction(actionDef.name, false);
                        } else {
                          handleToggleAction(actionDef.name, true);
                        }
                      }}
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value={actionDef.name}>{displayLabel}</MenuItem>
                    </Select>
                  </FormControl>
                  {enabled && renderActionParams(actionDef)}
                </Box>
              );
            }
          })}
      </Box>
    </Box>
  );
}
