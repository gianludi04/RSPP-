import { daysUntil } from '@/components/dashboard/DeadlineCard';

describe('daysUntil from DeadlineCard', () => {
  // Reference 'currentDate' for tests, normalized to the start of the day
  const todayNormalized = new Date();
  todayNormalized.setHours(0, 0, 0, 0);

  it('should return positive for future dates (e.g., 5 days from now)', () => {
    const futureDate = new Date(todayNormalized);
    futureDate.setDate(todayNormalized.getDate() + 5);
    expect(daysUntil(futureDate, todayNormalized)).toBe(5);
  });

  it('should return negative for past dates (e.g., 3 days ago)', () => {
    const pastDate = new Date(todayNormalized);
    pastDate.setDate(todayNormalized.getDate() - 3);
    expect(daysUntil(pastDate, todayNormalized)).toBe(-3);
  });

  it('should return 0 for today (target date is same as current date)', () => {
    const sameDayTarget = new Date(todayNormalized);
    expect(daysUntil(sameDayTarget, todayNormalized)).toBe(0);
  });
  
  it('should return 1 for tomorrow', () => {
    const tomorrow = new Date(todayNormalized);
    tomorrow.setDate(todayNormalized.getDate() + 1);
    expect(daysUntil(tomorrow, todayNormalized)).toBe(1);
  });

  it('should return -1 for yesterday', () => {
    const yesterday = new Date(todayNormalized);
    yesterday.setDate(todayNormalized.getDate() - 1);
    expect(daysUntil(yesterday, todayNormalized)).toBe(-1);
  });

  it('should return 0 when target date has later time but is same calendar day', () => {
    const targetLaterToday = new Date(todayNormalized);
    targetLaterToday.setHours(23, 0, 0, 0); // Time is later, but still same date
    // daysUntil normalizes this target to the start of its day.
    expect(daysUntil(targetLaterToday, todayNormalized)).toBe(0);
  });

  it('should return 0 when target date has earlier time but is same calendar day', () => {
    const currentMomentInDay = new Date(); // Represents a specific time, e.g., 10:00 AM
    currentMomentInDay.setHours(10,0,0,0);
    
    const targetEarlierToday = new Date(currentMomentInDay);
    targetEarlierToday.setHours(2,0,0,0); // Target time is 2:00 AM on the same day

    // daysUntil normalizes both its inputs (targetEarlierToday and currentMomentInDay)
    // to the start of their respective days. Since they are the same calendar day,
    // after normalization, their times will be equal, resulting in 0.
    expect(daysUntil(targetEarlierToday, currentMomentInDay)).toBe(0);
  });

  it('should handle midnight correctly: target is just after midnight (tomorrow), current is just before (today)', () => {
    const current = new Date(2024, 3, 10, 23, 59, 0); // April 10th, 2024, 23:59:00
    const target = new Date(2024, 3, 11, 0, 1, 0);   // April 11th, 2024, 00:01:00
    // Expected: target is 1 day after current, after normalization
    expect(daysUntil(target, current)).toBe(1);
  });

  it('should handle midnight correctly: target is just before midnight (today), current is just after (today)', () => {
    const current = new Date(2024, 3, 10, 0, 1, 0);  // April 10th, 2024, 00:01:00
    const target = new Date(2024, 3, 10, 23, 59, 0); // April 10th, 2024, 23:59:00
    // Expected: target is same day as current, after normalization
    expect(daysUntil(target, current)).toBe(0);
  });
  
  it('should handle date at the end of the month going to the start of next month', () => {
    const current = new Date(2024, 3, 30, 10, 0, 0); // April 30th, 2024
    const target = new Date(2024, 4, 1, 10, 0, 0);   // May 1st, 2024
    expect(daysUntil(target, current)).toBe(1);
  });

  it('should handle date at the start of the month going to the end of previous month', () => {
    const current = new Date(2024, 4, 1, 10, 0, 0);   // May 1st, 2024
    const target = new Date(2024, 3, 30, 10, 0, 0); // April 30th, 2024
    expect(daysUntil(target, current)).toBe(-1);
  });

  it('should handle year changes correctly', () => {
    const current = new Date(2023, 11, 31, 10, 0, 0); // Dec 31st, 2023
    const target = new Date(2024, 0, 1, 10, 0, 0);    // Jan 1st, 2024
    expect(daysUntil(target, current)).toBe(1);
  });
});
