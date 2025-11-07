"use client";

import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  searchContainerStyles,
  searchInputStyles,
} from "./styles/searchAndFiltersStyles";
import { useState, useEffect } from "react";
import { useFiltersList } from "@/hooks/useFiltersList";
import { LABELS } from "@/config/constants";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
}: SearchAndFiltersProps) {
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearchChange]);

  const handleClearSearch = () => {
    setInputValue("");
    onSearchChange("");
  };

  return (
    <Box sx={searchContainerStyles}>
      <TextField
        placeholder={LABELS.SEARCH_HERE}
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        sx={searchInputStyles}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {inputValue && (
                <IconButton onClick={handleClearSearch} edge="end">
                  <CloseIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
