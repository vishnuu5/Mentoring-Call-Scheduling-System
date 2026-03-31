const TIMEZONE_OFFSETS = {
  GMT: 0,
  IST: 5.5,
};

export const convertTime = (time, fromTz, toTz) => {
  const fromOffset = TIMEZONE_OFFSETS[fromTz] || 0;
  const toOffset = TIMEZONE_OFFSETS[toTz] || 0;
  const diff = (toOffset - fromOffset) * 60; 

  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + diff;

  let newHours = Math.floor(totalMinutes / 60) % 24;
  let newMinutes = totalMinutes % 60;

  if (newHours < 0) newHours += 24;
  if (newMinutes < 0) newMinutes += 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

export const getWeekDates = (startDate = new Date()) => {
  const dates = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
