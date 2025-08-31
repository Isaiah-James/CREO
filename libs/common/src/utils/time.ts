export function getTimeBasedGreeting(time: Date) {
  const h = time.getHours();

  if (h < 12) {
    return 'Good Morning';
  } else if (h >= 12 && h < 18) {
    return 'Good Afternoon';
  } else if (h >= 16 && h < 20) {
    return 'Good Evening';
  } else return 'Greetings';
};