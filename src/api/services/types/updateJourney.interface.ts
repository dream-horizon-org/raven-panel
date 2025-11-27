import { RuleInput } from "./createJourney.interface";

export interface UpdateCtaInput {
  id: string;
  description: string;
  team: string;
  tags: string[];
  startTime: number | null;
  endTime: number | null;
  rule: RuleInput;
}
