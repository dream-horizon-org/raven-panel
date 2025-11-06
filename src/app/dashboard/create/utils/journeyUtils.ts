export const generateRandomJourneyName = (): string => {
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `Journey ${randomNumber}`;
};
