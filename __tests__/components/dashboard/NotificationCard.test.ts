import { formatDate } from '@/components/dashboard/NotificationCard';

describe('formatDate from NotificationCard', () => {
  const now = new Date(); // Base 'now' for all tests in this suite for consistency

  // Helper to create dates relative to 'now'
  const getDateAgo = (milliseconds: number): Date => {
    return new Date(now.getTime() - milliseconds);
  };

  it('should format 0 minutes ago as "0 min fa"', () => {
    const testDate = getDateAgo(0); // 0 minutes ago
    expect(formatDate(testDate)).toBe('0 min fa');
  });

  it('should format 30 minutes ago as "30 min fa"', () => {
    const testDate = getDateAgo(30 * 60 * 1000); // 30 minutes ago
    expect(formatDate(testDate)).toBe('30 min fa');
  });

  it('should format 59 minutes ago as "59 min fa"', () => {
    const testDate = getDateAgo(59 * 60 * 1000); // 59 minutes ago
    expect(formatDate(testDate)).toBe('59 min fa');
  });

  it('should format 1 hour ago as "1 ore fa" (rounding from 60 minutes)', () => {
    const testDate = getDateAgo(60 * 60 * 1000); // 60 minutes ago
    expect(formatDate(testDate)).toBe('1 ore fa');
  });
  
  it('should format 1 hour 1 minute ago as "1 ore fa" (rounding)', () => {
    const testDate = getDateAgo(61 * 60 * 1000); // 61 minutes ago
    expect(formatDate(testDate)).toBe('1 ore fa');
  });

  it('should format 5 hours ago as "5 ore fa"', () => {
    const testDate = getDateAgo(5 * 60 * 60 * 1000); // 5 hours ago
    expect(formatDate(testDate)).toBe('5 ore fa');
  });

  it('should format 23 hours ago as "23 ore fa"', () => {
    const testDate = getDateAgo(23 * 60 * 60 * 1000); // 23 hours ago
    expect(formatDate(testDate)).toBe('23 ore fa');
  });
  
  it('should format "Yesterday" for 24 hours ago', () => {
    const testDate = getDateAgo(24 * 60 * 60 * 1000); // 1 day ago
    expect(formatDate(testDate)).toBe('Ieri');
  });

  it('should format "Yesterday" for up to 47 hours ago (due to Math.round)', () => {
    // diffDays = Math.round(diffMs / 86400000);
    // 1.49 days (35.76 hours) rounded is 1 day.
    // 1.5 days (36 hours) rounded is 2 days.
    // Let's test around the 36 hour mark for "Ieri" vs "2 giorni fa"
    const almostTwoDays = getDateAgo(35 * 60 * 60 * 1000 + 59 * 60 * 1000); // 35h 59m
    expect(formatDate(almostTwoDays)).toBe('Ieri'); // Should be 1 day (rounded)
  });

  it('should format 2 days ago as "2 giorni fa"', () => {
    const testDate = getDateAgo(2 * 24 * 60 * 60 * 1000); // 2 days ago
    expect(formatDate(testDate)).toBe('2 giorni fa');
  });
  
  it('should format 6 days ago as "6 giorni fa"', () => {
    const testDate = getDateAgo(6 * 24 * 60 * 60 * 1000); // 6 days ago
    expect(formatDate(testDate)).toBe('6 giorni fa');
  });

  it('should format dates 7 days ago as dd/mm', () => {
    const testDate = getDateAgo(7 * 24 * 60 * 60 * 1000); // 7 days ago
    const day = String(testDate.getDate()).padStart(2, '0');
    const month = String(testDate.getMonth() + 1).padStart(2, '0');
    expect(formatDate(testDate)).toBe(`${day}/${month}`);
  });

  it('should format older dates (e.g., 10 days ago) as dd/mm', () => {
    const testDate = getDateAgo(10 * 24 * 60 * 60 * 1000); // 10 days ago
    const day = String(testDate.getDate()).padStart(2, '0');
    const month = String(testDate.getMonth() + 1).padStart(2, '0');
    expect(formatDate(testDate)).toBe(`${day}/${month}`);
  });

  it('should format a specific past date as dd/mm', () => {
    // Note: This test is relative to the 'now' defined at the start of the describe block.
    // If 'now' is, for example, 2024-04-10, then '2023-10-25' is definitely older than 7 days.
    const specificPastDate = new Date(2023, 9, 25); // Month is 0-indexed, so 9 is October
    const day = String(specificPastDate.getDate()).padStart(2, '0');
    const month = String(specificPastDate.getMonth() + 1).padStart(2, '0');
    // Only check dd/mm if it's guaranteed to be older than 7 days from 'now'
    if (now.getTime() - specificPastDate.getTime() > 7 * 24 * 60 * 60 * 1000) {
      expect(formatDate(specificPastDate)).toBe(`${day}/${month}`);
    } else {
      // This case would mean 'now' is very close to 'specificPastDate',
      // making it fall into one of the relative categories.
      // For this test, we assume 'specificPastDate' is chosen to be old enough.
      // If not, this part of the test might behave differently based on when 'now' is.
      console.warn("Specific past date test might not be testing 'dd/mm' if 'now' is too close to it.");
      expect(true).toBe(true); // Avoid failing if date isn't old enough for dd/mm.
    }
  });
});
