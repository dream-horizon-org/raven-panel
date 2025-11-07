"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Menu,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UIElement, TextElement, ImageElement, ViewElement } from "../../types";
import ElementConfigEditor from "./ElementConfigEditor";
import NestedElementEditor from "./NestedElementEditor";

interface EngagementContentEditorProps {
  elements: UIElement[];
  onElementsChange: (elements: UIElement[]) => void;
}

export default function EngagementContentEditor({
  elements,
  onElementsChange,
}: EngagementContentEditorProps) {
  const [expandedElement, setExpandedElement] = useState<string | false>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [viewElementAnchors, setViewElementAnchors] = useState<Record<string, HTMLElement | null>>({});

  const handleAddElement = (type: "view" | "text" | "image") => {
    const newElement: UIElement = (() => {
      const baseId = `element-${Date.now()}`;
      switch (type) {
        case "text":
          return {
            id: baseId,
            type: "text",
            text: "",
            textAlignment: "left",
            textColor: "#000000",
            fontSize: 16,
            spacing: {
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
            },
          } as TextElement;
        case "image":
          return {
            id: baseId,
            type: "image",
            imageSource: "",
            clickAction: "none",
            occupyFullWidth: false,
            spacing: {
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
            },
          } as ImageElement;
        case "view":
          return {
            id: baseId,
            type: "view",
            orientation: "vertical",
            children: [],
            spacing: {
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
            },
          } as ViewElement;
      }
    })();

    onElementsChange([...elements, newElement]);
    setExpandedElement(newElement.id);
    setAnchorEl(null);
  };

  const handleDeleteElement = (elementId: string) => {
    onElementsChange(elements.filter((el) => el.id !== elementId));
    if (expandedElement === elementId) {
      setExpandedElement(false);
    }
  };

  const handleDuplicateElement = (elementId: string) => {
    const element = elements.find((el) => el.id === elementId);
    if (element) {
      const duplicated = {
        ...element,
        id: `element-${Date.now()}`,
      };
      const index = elements.findIndex((el) => el.id === elementId);
      const newElements = [...elements];
      newElements.splice(index + 1, 0, duplicated);
      onElementsChange(newElements);
      setExpandedElement(duplicated.id);
    }
  };

  const handleUpdateElement = (elementId: string, updates: Partial<UIElement>) => {
    onElementsChange(
      elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el))
    );
  };

  const handleUpdateViewChildren = (elementId: string, children: UIElement[]) => {
    onElementsChange(
      elements.map((el) => {
        if (el.id === elementId && el.type === "view") {
          return { ...el, children } as ViewElement;
        }
        return el;
      })
    );
  };

  const getElementLabel = (element: UIElement): string => {
    switch (element.type) {
      case "text":
        return `Text: ${(element as TextElement).text || "Empty"}`;
      case "image":
        return `Image: ${(element as ImageElement).imageSource ? "Set" : "Not set"}`;
      case "view":
        return `View (${(element as ViewElement).orientation || "vertical"})`;
      default:
        return "Element";
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            Content Elements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure the UI elements for your engagement
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<AddIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ minWidth: 160 }}
        >
          Add Element
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleAddElement("view")}>View</MenuItem>
          <MenuItem onClick={() => handleAddElement("text")}>Text</MenuItem>
          <MenuItem onClick={() => handleAddElement("image")}>Image</MenuItem>
        </Menu>
      </Box>

      {elements.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
            No elements added yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the "Add Element" dropdown to start building your engagement UI
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {elements.map((element, index) => (
              <Accordion
                key={element.id}
                expanded={expandedElement === element.id}
                onChange={(_, isExpanded) => setExpandedElement(isExpanded ? element.id : false)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    borderColor: "primary.main",
                    boxShadow: 1,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    "&.Mui-expanded": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", pr: 2 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {getElementLabel(element)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={() => handleDuplicateElement(element.id)}
                        sx={{ p: 0.75 }}
                        title="Duplicate"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteElement(element.id)}
                        color="error"
                        sx={{ p: 0.75 }}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <ElementConfigEditor
                    element={element}
                    onUpdate={(updates) => handleUpdateElement(element.id, updates)}
                  />
                  {element.type === "view" && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        Child Elements
                      </Typography>
                      <NestedElementEditor
                        elements={(element as ViewElement).children || []}
                        onElementsChange={(children) => handleUpdateViewChildren(element.id, children)}
                        level={1}
                      />
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={(e) => {
                            setViewElementAnchors((prev) => ({
                              ...prev,
                              [element.id]: e.currentTarget,
                            }));
                          }}
                          sx={{ minWidth: 140 }}
                        >
                          Add Element
                        </Button>
                        <Menu
                          anchorEl={viewElementAnchors[element.id] || null}
                          open={Boolean(viewElementAnchors[element.id])}
                          onClose={() => {
                            setViewElementAnchors((prev) => ({
                              ...prev,
                              [element.id]: null,
                            }));
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              const viewElement = elements.find((el) => el.id === element.id) as ViewElement;
                              if (viewElement) {
                                const newChildren = [...(viewElement.children || [])];
                                const newElement: UIElement = {
                                  id: `element-${Date.now()}-${Math.random()}`,
                                  type: "view",
                                  orientation: "vertical",
                                  children: [],
                                  spacing: {
                                    margin: { top: 0, right: 0, bottom: 0, left: 0 },
                                    padding: { top: 0, right: 0, bottom: 0, left: 0 },
                                  },
                                } as ViewElement;
                                handleUpdateViewChildren(element.id, [...newChildren, newElement]);
                                setViewElementAnchors((prev) => ({
                                  ...prev,
                                  [element.id]: null,
                                }));
                              }
                            }}
                          >
                            View
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              const viewElement = elements.find((el) => el.id === element.id) as ViewElement;
                              if (viewElement) {
                                const newChildren = [...(viewElement.children || [])];
                                const newElement: UIElement = {
                                  id: `element-${Date.now()}-${Math.random()}`,
                                  type: "text",
                                  text: "",
                                  textAlignment: "left",
                                  textColor: "#000000",
                                  fontSize: 16,
                                  spacing: {
                                    margin: { top: 0, right: 0, bottom: 0, left: 0 },
                                    padding: { top: 0, right: 0, bottom: 0, left: 0 },
                                  },
                                } as TextElement;
                                handleUpdateViewChildren(element.id, [...newChildren, newElement]);
                                setViewElementAnchors((prev) => ({
                                  ...prev,
                                  [element.id]: null,
                                }));
                              }
                            }}
                          >
                            Text
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              const viewElement = elements.find((el) => el.id === element.id) as ViewElement;
                              if (viewElement) {
                                const newChildren = [...(viewElement.children || [])];
                                const newElement: UIElement = {
                                  id: `element-${Date.now()}-${Math.random()}`,
                                  type: "image",
                                  imageSource: "",
                                  clickAction: "none",
                                  occupyFullWidth: false,
                                  spacing: {
                                    margin: { top: 0, right: 0, bottom: 0, left: 0 },
                                    padding: { top: 0, right: 0, bottom: 0, left: 0 },
                                  },
                                } as ImageElement;
                                handleUpdateViewChildren(element.id, [...newChildren, newElement]);
                                setViewElementAnchors((prev) => ({
                                  ...prev,
                                  [element.id]: null,
                                }));
                              }
                            }}
                          >
                            Image
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

