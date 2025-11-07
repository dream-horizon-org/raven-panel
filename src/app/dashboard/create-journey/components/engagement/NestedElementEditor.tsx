"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Menu,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { UIElement, TextElement, ImageElement, ViewElement } from "../../types";
import ElementConfigEditor from "./ElementConfigEditor";

interface NestedElementEditorProps {
  elements: UIElement[];
  onElementsChange: (elements: UIElement[]) => void;
  level?: number;
}

export default function NestedElementEditor({
  elements,
  onElementsChange,
  level = 0,
}: NestedElementEditorProps) {
  const [expandedElement, setExpandedElement] = useState<string | false>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAddElement = (type: "view" | "text" | "image") => {
    const newElement: UIElement = (() => {
      const baseId = `element-${Date.now()}-${Math.random()}`;
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
        id: `element-${Date.now()}-${Math.random()}`,
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
    const updatedElements = elements.map((el) => {
      if (el.id === elementId && el.type === "view") {
        return { ...el, children } as ViewElement;
      }
      return el;
    });
    onElementsChange(updatedElements);
  };

  const getElementLabel = (element: UIElement): string => {
    switch (element.type) {
      case "text":
        return `Text: ${(element as TextElement).text || "Empty"}`;
      case "image":
        return `Image: ${(element as ImageElement).imageSource ? "Set" : "Not set"}`;
      case "view":
        const viewEl = element as ViewElement;
        return `View (${viewEl.orientation || "vertical"}) - ${viewEl.children?.length || 0} child(ren)`;
      default:
        return "Element";
    }
  };

  return (
    <Box>
      {elements.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            No child elements
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pl: level > 0 ? 2 : 0 }}>
          {elements.map((element) => (
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
                  <Typography variant="body2" fontWeight={500}>
                    {getElementLabel(element)}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      onClick={() => handleDuplicateElement(element.id)}
                      sx={{ p: 0.5 }}
                      title="Duplicate"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteElement(element.id)}
                      color="error"
                      sx={{ p: 0.5 }}
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
                      level={level + 1}
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
      )}
      {elements.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ minWidth: 140 }}
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
      )}
    </Box>
  );
}

