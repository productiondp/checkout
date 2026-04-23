"use client";

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
