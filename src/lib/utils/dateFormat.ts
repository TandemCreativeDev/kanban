/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Check if a date is in the past
 */
export function isPastDue(dateString?: string): boolean {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Remove time part for comparison
  const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return dateWithoutTime < nowWithoutTime;
}