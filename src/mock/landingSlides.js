const getIcon = (x) => <img src={`/assets/icons/landing/slide${x}.svg`} alt="" />;

export const slides = [
  {
    id: 1,
    icon: null,
    title: "Welcome",
    text: "XGOL aims to elevate your public speaking skills through an immersive and empowering experience, driven by insightful assessments and personalized support.",
  },
  {
    id: 2,
    icon: getIcon(1),
    title: "Write Your Speech",
    text: "Start by crafting your message.",
  },
  {
    id: 3,
    icon: getIcon(2),
    title: "Improve with AI",
    text: "Refine your speech with the help of generative AI",
  },
  {
    id: 4,
    icon: getIcon(3),
    title: "Practice It",
    text: "Rehearse your speech within the simulator",
  },
  {
    id: 5,
    icon: getIcon(4),
    title: "Get AI and Expert Feedback",
    text: "Receive tailored in-depth feedback to improve your performance.",
  },
  {
    id: 6,
    icon: getIcon(5),
    title: "Rehearse and Become an Expert",
    text: "Continue practicing and refining your skills to master public speaking.",
  },
];
