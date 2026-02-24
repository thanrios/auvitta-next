import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes with clsx and twMerge.
 * @param inputs - An array of class names or conditional class objects.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format an ISO date string to a DD/MM/YY format.
 * @param dateValue - The ISO date string to be formatted.
 * @param format - The desired date format (optional).
 * @returns The formatted date string in the specified format.
 */
export function formatIsoDate(dateValue?: string, format?: string): string {
  if (!dateValue) {
    return '-'
  }

  const [year, month, day] = dateValue.split('-')

  if (!year || !month || !day) {
    return '-'
  }

  if (format === 'DD/MM/YY') {
    return `${day}/${month}/${year.slice(-2)}`
  }

  return `${day}/${month}/${year}`
}
