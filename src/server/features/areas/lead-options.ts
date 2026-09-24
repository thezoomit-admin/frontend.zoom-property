/** Shared lead-form area option shapes (safe for client + server). */

export type LeadSubAreaOption = {
  value: string;
  label: string;
};

export type LeadAreaOption = {
  value: string;
  label: string;
  slug: string;
  subAreas: LeadSubAreaOption[];
};
