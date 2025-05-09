/**
 * Format a date to a human-readable format
 */
export function formatDate(date?: Date): string {
  if (!date) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Check if a date is in the past
 */
export function isPastDue(date?: Date): boolean {
  if (!date) return false;

  const now = new Date();

  // Remove time part for comparison
  const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return dateWithoutTime < nowWithoutTime;
}
