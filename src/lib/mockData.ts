export const mockJourneys = Array.from({ length: 10 }, () => ({
  name: "Journey 1",
  startingEvent: "Event 1",
  comms: ["mobile"],
  priority: "1/10",
  createdOn: "13 July '25",
  createdBy: "Shruti Pathak",
  status: ["Live", "Draft", "Terminated"][Math.floor(Math.random() * 3)] as
    | "Live"
    | "Draft"
    | "Terminated",
}));

export const JOURNEY_ICONS = [
  "🦩", // Flamingo
  "📅", // Calendar
  "🍕", // Pizza
  "🌻", // Sunflower
  "🎵", // Musical notes
  "🎡", // Ferris wheel
  "🎯", // Target
  "⭐", // Star
  "🎠", // Carousel horse
  "🦄", // Unicorn
  "🍬", // Candy
  "🌍", // Globe
  "🎨", // Artist palette
  "🎪", // Circus tent
  "🎭", // Theater masks
  "🎸", // Guitar
  "🎹", // Piano
  "🎺", // Trumpet
  "🎤", // Microphone
  "🎬", // Movie camera
  "🎮", // Video game controller
  "🎲", // Dice
  "🎰", // Slot machine
  "🎱", // Pool ball
  "🎳", // Bowling
  "🏆", // Trophy
  "🎁", // Gift
  "🎈", // Balloon
  "🎉", // Party popper
  "🎊", // Confetti ball
];
