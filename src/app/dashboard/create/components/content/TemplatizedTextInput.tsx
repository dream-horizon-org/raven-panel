"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  InputAdornment,
  Typography,
  alpha,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  DynamicTextValueType,
  DynamicTextStaticType,
  DynamicTextDynamicType,
  EventInfo,
} from "../../types/journey.interface";
import { EventListItem, EventProperty } from "@/api/services/types/events.interface";
import { useEventDetails } from "../../hooks/useEventsList";
import {
  textToPartsArray,
  isTemplateVariable,
  splitTemplateVariable,
} from "../../utils/templateStringParsing.utils";
import {
  parseTemplateString,
  stringifyTemplate,
} from "../../utils/templateStringConversion.utils";

interface TemplatizedTextInputProps {
  value: DynamicTextValueType | undefined;
  onChange: (value: DynamicTextValueType) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  events: EventListItem[];
  eventInfo: EventInfo[];
  contextParams: { id: number; label: string }[];
}

export default function TemplatizedTextInput({
  value,
  onChange,
  label,
  placeholder,
  required,
  error,
  helperText,
  events,
  eventInfo,
}: TemplatizedTextInputProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [displayValue, setDisplayValue] = useState(() => stringifyTemplate(value));

  // Get event details for selected event
  const { data: eventDetailsData } = useEventDetails(selectedEvent || null);

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(stringifyTemplate(value));
  }, [value]);

  // Split text into parts for overlay rendering
  const parts = useMemo(() => textToPartsArray(displayValue), [displayValue]);

  const handleAddTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get cursor position if input is available, otherwise add at end
    const input = inputRef.current;
    let insertPosition = input?.selectionStart ?? displayValue.length;
    
    // Check if cursor is inside an existing {{...}} - if so, insert AFTER it
    const text = displayValue;
    let pos = 0;
    while (pos < text.length) {
      const openPos = text.indexOf("{{", pos);
      if (openPos === -1) break;
      
      const closePos = text.indexOf("}}", openPos + 2);
      if (closePos === -1) break;
      
      // If cursor is inside this {{...}}, move insertion point to after }}
      if (insertPosition > openPos && insertPosition <= closePos + 2) {
        insertPosition = closePos + 2;
        break;
      }
      
      pos = closePos + 2;
    }
    
    // Insert {{}} at the determined position
    const newValue = text.substring(0, insertPosition) + "{{}}" + text.substring(insertPosition);
    
    setDisplayValue(newValue);
    onChange(parseTemplateString(newValue));
    
    // Focus and position cursor inside the new braces
    setTimeout(() => {
      if (inputRef.current) {
        const cursorPos = insertPosition + 2; // Inside the new {{}}
        inputRef.current.focus();
        inputRef.current.setSelectionRange(cursorPos, cursorPos);
        setCursorPosition(cursorPos);
        // Open popover for the new empty braces
        setAnchorEl(containerRef.current);
        setSelectedEvent(null);
      }
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    onChange(parseTemplateString(newValue));
    // Close popover when text changes
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  // Check if cursor is inside {{...}} and open popover
  const checkAndOpenPopover = () => {
    if (!inputRef.current) return;
    
    const input = inputRef.current;
    const cursorPos = input.selectionStart || 0;
    setCursorPosition(cursorPos);

    const text = input.value;
    
    // Check if cursor is inside any {{...}} (empty or filled)
    let pos = 0;
    while (pos < text.length) {
      const openPos = text.indexOf("{{", pos);
      if (openPos === -1) break;
      
      const closePos = text.indexOf("}}", openPos + 2);
      if (closePos === -1) break;
      
      const start = openPos + 2;
      const end = closePos;
      
      // Check if cursor is inside this {{...}}
      if (cursorPos >= start && cursorPos <= end) {
        // Extract the content between {{ and }}
        const content = text.substring(start, end);
        
        // Check if there's a ;default: in the content
        const defaultIndex = content.indexOf(";default:");
        
        if (defaultIndex !== -1) {
          // Calculate the position of ;default: in the full text
          const defaultPos = start + defaultIndex;
          
          // Only open popover if cursor is BEFORE ;default: (in the property name area)
          // Don't open if cursor is in or after ;default: (in the default value area)
          if (cursorPos <= defaultPos) {
            setAnchorEl(containerRef.current);
            setSelectedEvent(null);
            return;
          }
        } else {
          // No default value, always open popover
          setAnchorEl(containerRef.current);
          setSelectedEvent(null);
          return;
        }
      }
      
      pos = closePos + 2;
    }
    
    // Not inside any {{}}, close popover
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleInputClick = () => {
    setTimeout(() => checkAndOpenPopover(), 50);
  };

  const handleSelectEvent = (eventName: string) => {
    setSelectedEvent(eventName);
  };

  const handleSelectProperty = (propertyPath: string) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const currentCursorPos = input.selectionStart || cursorPosition;
    const textBeforeCursor = input.value.substring(0, currentCursorPos);
    const textAfterCursor = input.value.substring(currentCursorPos);
    
    // Find the {{}} we're inside
    const lastOpenBrace = textBeforeCursor.lastIndexOf("{{");
    const nextCloseBraceOffset = textAfterCursor.indexOf("}}");
    
    if (lastOpenBrace !== -1 && nextCloseBraceOffset !== -1) {
      // Calculate absolute positions
      const closeBracePos = currentCursorPos + nextCloseBraceOffset;
      
      const beforeTemplate = input.value.substring(0, lastOpenBrace + 2);
      const afterTemplate = input.value.substring(closeBracePos); // Start from }} onwards
      
      // Add property with default value syntax
      const propertyWithDefault = `${propertyPath};default:""`;
      const newValue = beforeTemplate + propertyWithDefault + afterTemplate;
      
      setDisplayValue(newValue);
      onChange(parseTemplateString(newValue));
      setAnchorEl(null);
      setSelectedEvent(null);
      
      // Focus back and position cursor after the inserted property (inside the quotes for default value)
      setTimeout(() => {
        if (inputRef.current) {
          // Position cursor between the quotes: {{propertyPath;default:"|"}}
          const newCursorPos = lastOpenBrace + 2 + propertyPath.length + 10; // +10 for ';default:"'
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  // Get event properties from event details
  const getEventProperties = (eventName: string): EventProperty[] => {
    if (eventDetailsData?.data && selectedEvent === eventName) {
      return eventDetailsData.data.properties || [];
    }
    // Fallback to events list if details not loaded
    const event = events.find((e) => e.eventName === eventName);
    return event?.properties || [];
  };

  // Get unique event names from eventInfo
  const journeyEventNames = Array.from(
    new Set(eventInfo.map((info) => info.eventname))
  );

  // Filter items based on search query
  const filteredEvents = journeyEventNames.filter((eventName) =>
    eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get filtered properties for selected event
  const filteredProperties = selectedEvent
    ? getEventProperties(selectedEvent).filter((prop) =>
        prop.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 1 }}>
      {/* Input container with label */}
      <Box sx={{ position: "relative" }}>
        {/* Label */}
        {label && (
          <Typography
            component="label"
            sx={{
              position: "absolute",
              top: -8,
              left: 12,
              px: 0.5,
              fontSize: "0.75rem",
              bgcolor: "background.paper",
              color: error ? "error.main" : isFocused ? "primary.main" : "text.secondary",
              zIndex: 3,
            }}
          >
            {label}
            {required && " *"}
          </Typography>
        )}

        {/* Input box */}
        <Box
          ref={containerRef}
          sx={{
            position: "relative",
            minWidth: 300,
            maxWidth: 460,
            height: 40,
            border: 1,
            borderColor: error ? "error.main" : isFocused ? "primary.main" : "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
            "&:hover": {
              borderColor: error ? "error.main" : isFocused ? "primary.main" : "text.primary",
            },
          }}
        >
          {/* Overlay layer - renders styled text */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                px: "14px",
                transform: `translateX(${-scrollPosition}px)`,
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "40px",
                height: "40px",
              }}
            >
              {parts.length === 0 && !isFocused && placeholder && (
                <Typography
                  component="span"
                  sx={{
                    color: "text.disabled",
                    fontFamily: "monospace",
                    fontSize: "14px",
                  }}
                >
                  {placeholder}
                </Typography>
              )}
              {parts.map((part, index) => {
                if (isTemplateVariable(part)) {
                  const { open, content, close } = splitTemplateVariable(part);
                  return (
                    <Box component="span" key={index}>
                      {/* Opening {{ in blue */}
                      <Box
                        component="span"
                        sx={{
                          color: "#1976d2",
                          fontFamily: "monospace",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        {open}
                      </Box>
                      {/* Content in normal color */}
                      <Box
                        component="span"
                        sx={{
                          color: "text.primary",
                          fontFamily: "monospace",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        {content}
                      </Box>
                      {/* Closing }} in blue */}
                      <Box
                        component="span"
                        sx={{
                          color: "#1976d2",
                          fontFamily: "monospace",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        {close}
                      </Box>
                    </Box>
                  );
                } else {
                  return (
                    <Box
                      component="span"
                      key={index}
                      sx={{
                        color: "text.primary",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        fontWeight: 400,
                        whiteSpace: "pre",
                      }}
                    >
                      {part}
                    </Box>
                  );
                }
              })}
            </Box>
          </Box>

          {/* Transparent input - handles actual input */}
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onSelect={handleInputClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onScroll={(e) => {
              setScrollPosition((e.target as HTMLInputElement).scrollLeft);
            }}
            placeholder=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              padding: "0 14px",
              margin: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "monospace",
              fontSize: "14px",
              lineHeight: "40px",
              color: "transparent",
              caretColor: "#000",
              zIndex: 2,
              overflow: "auto",
            }}
          />
        </Box>
      </Box>

      {/* Add template button - OUTSIDE the input */}
      <IconButton
        size="small"
        onClick={handleAddTemplate}
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          "&:hover": {
            bgcolor: alpha("#1976d2", 0.1),
            borderColor: "primary.main",
          },
          "& .curly-braces": {
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: "14px",
            color: "#1976d2",
          },
        }}
        title="Add template variable"
      >
        <span className="curly-braces">{"{{}}"}</span>
      </IconButton>

      {/* Helper text */}
      {helperText && (
        <Typography
          variant="caption"
          sx={{
            color: error ? "error.main" : "text.secondary",
            mt: 0.5,
            ml: 1.5,
            display: "block",
          }}
        >
          {helperText}
        </Typography>
      )}

      {/* Popover for selecting variables */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setSelectedEvent(null);
          setSearchQuery("");
        }}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ width: 350, height: 400, display: "flex", flexDirection: "column" }}>
          {/* Header with Search or Back Button */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            {selectedEvent ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small" onClick={() => setSelectedEvent(null)}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {selectedEvent}
                </Typography>
              </Box>
            ) : (
              <TextField
                fullWidth
                size="small"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            )}
          </Box>

          {/* Content Area - Either Events or Properties */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {!selectedEvent ? (
              /* Events List */
              <List dense sx={{ pt: 0 }}>
                {filteredEvents.map((eventName) => (
                  <ListItemButton
                    key={eventName}
                    onClick={() => handleSelectEvent(eventName)}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha("#000", 0.04),
                      },
                    }}
                  >
                    <ListItemText 
                      primary={eventName}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        color: "primary.main",
                      }}
                    />
                    <ArrowForwardIcon fontSize="small" sx={{ color: "action.disabled" }} />
                  </ListItemButton>
                ))}
                {filteredEvents.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No events found"
                      secondary={journeyEventNames.length === 0 ? "Add events to your journey first" : "Try a different search"}
                      primaryTypographyProps={{ fontSize: "0.875rem" }}
                      secondaryTypographyProps={{ fontSize: "0.75rem" }}
                    />
                  </ListItem>
                )}
              </List>
            ) : (
              /* Properties List */
              <List dense sx={{ pt: 0 }}>
                {filteredProperties.map((prop) => (
                  <ListItemButton
                    key={prop.propertyName}
                    onClick={() => handleSelectProperty(prop.propertyName)}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha("#000", 0.04),
                      },
                    }}
                  >
                    <ListItemText
                      primary={prop.propertyName}
                      secondary={prop.type}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                      }}
                    />
                  </ListItemButton>
                ))}
                {filteredProperties.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No properties available"
                      secondary="This event has no properties"
                      primaryTypographyProps={{ fontSize: "0.875rem" }}
                      secondaryTypographyProps={{ fontSize: "0.75rem" }}
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
