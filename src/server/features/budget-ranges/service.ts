import "server-only";

import { get } from "../../base-api/client";

export type BudgetOption = {
  value: string;
  label: string;
};

type ApiBudgetRange = {
  _id?: string;
  name: string;
  nameBn?: string;
  value: string;
  order?: number;
  isActive?: boolean;
};

const FALLBACK: { value: string; en: string; bn: string }[] = [
  { value: "any", en: "Not sure yet", bn: "এখনও ঠিক করিনি" },
  { value: "under1", en: "Under ৳1 Cr", bn: "১ কোটির নিচে" },
  { value: "1to2", en: "৳1 – 2 Cr", bn: "১ – ২ কোটি" },
  { value: "2to5", en: "৳2 – 5 Cr", bn: "২ – ৫ কোটি" },
  { value: "5to10", en: "৳5 – 10 Cr", bn: "৫ – ১০ কোটি" },
  { value: "over10", en: "৳10 Cr and above", bn: "১০ কোটি বা তার বেশি" },
];

/**
 * Active budget bands for the contact form.
 * Seeded on the API from the old hard-coded list; falls back if the API is down.
 */
export async function getBudgetOptions(
  locale: "en" | "bn" = "en",
): Promise<BudgetOption[]> {
  const res = await get<ApiBudgetRange[]>("budget-ranges", {
    isActive: "true",
  });
  const rows = Array.isArray(res?.data) ? res.data : [];
  if (!rows.length) {
    return FALLBACK.map((row) => ({
      value: row.value,
      label: locale === "bn" ? row.bn : row.en,
    }));
  }
  return [...rows]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((row) => ({
      value: row.value,
      label:
        locale === "bn" && row.nameBn?.trim()
          ? row.nameBn.trim()
          : row.name,
    }));
}
