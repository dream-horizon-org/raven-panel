"use client";
import { Box, Chip, Tab, Tabs } from "@mui/material";
import {
  statusTabsContainerStyles,
  statusTabStyles,
  statusTabLabelContainerStyles,
} from "./styles/statusTabStyles";
import { STATUSES } from "./DashboardConstants";

export type Status = typeof STATUSES[number];
export type StatusCounts = Partial<Record<Status, number>>;

export default function StatusTabs({
  value,
  onChange,
  counts,
}: {
  value: Status;
  onChange: (s: Status) => void;
  counts?: StatusCounts;
}) {
  const LABEL_MAP: Record<Status, string> = {
    ALL: "All",
    DRAFT: "Draft",
    LIVE: "Live",
    SCHEDULED: "Scheduled",
    PAUSED: "Paused",
    CONCLUDED: "Concluded",
    TERMINATED: "Terminated",
  };

  return (
    <Box sx={statusTabsContainerStyles}>
      <Tabs value={value} onChange={(_, v) => onChange(v)} variant="scrollable">
        {STATUSES.map((s) => (
          <Tab
            key={s}
            value={s}
            sx={statusTabStyles}
            label={
              <Box sx={statusTabLabelContainerStyles}>
                {LABEL_MAP[s]}
                <Chip size="small" label={counts?.[s] ?? 0} />
              </Box>
            }
          />
        ))}
      </Tabs>
    </Box>
  );
}
