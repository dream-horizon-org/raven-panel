import { transformFormDataToApiFormat } from "../createJourney.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";

describe("createJourney.utils", () => {
  describe("transformFormDataToApiFormat", () => {
    it("should transform basic form data to API format", () => {
      const formData: CreateJourneyFormData = {
        testFeature: {
          isTestFeatureEnabled: false,
        },
        ctaMetadata: {
          ctaTitle: "Test Journey",
          description: "Test Description",
          team: "Test Team",
          tags: [{ id: 1, label: "tag1" }],
        },
        selectCohort: {
          includedCohorts: ["cohort1"],
          exculdedCohorts: ["cohort2"],
        },
        contextParams: [{ id: 1, label: "param1" }],
        schedule: {
          enableImmediateStart: true,
        },
        journeyFrequency: {
          maxTimesInLifetime: 10,
          timesInSession: 5,
          maxTimesInPeriod: 3,
          periodValue: 7,
          periodUnit: "days",
        },
        ruleEngine: {
          eventInfo: [],
        },
        nudgeSelection: {
          actions: [
            {
              actionId: "action1",
              type: "TOOLTIP" as any,
              template: {
                type: "TOOLTIP",
                props: { testID: "test" },
                children: [],
                actions: [],
                styles: {},
              },
              onState: "1",
            },
          ],
          resetStates: ["1"],
        },
      } as any;

      const result = transformFormDataToApiFormat(formData);

      expect(result.name).toBe("Test Journey");
      expect(result.description).toBe("Test Description");
      expect(result.team).toBe("Test Team");
      expect(result.tags).toEqual(["tag1"]);
      expect(result.rule.cohortEligibility.includes).toEqual(["cohort1"]);
      expect(result.rule.cohortEligibility.excludes).toEqual(["cohort2"]);
      expect(result.rule.contextParams).toEqual(["param1"]);
      expect(result.startTime).toBeDefined();
      expect(result.rule.frequency.lifespan.limit).toBe(10);
      expect(result.rule.frequency.session.limit).toBe(5);
      expect(result.rule.frequency.window.limit).toBe(3);
      expect(result.rule.actions).toHaveLength(1);
      expect(result.rule.resetStates).toEqual(["1"]);
    });
  });
});
