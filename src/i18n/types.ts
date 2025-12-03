// src/i18n/types.ts
// Type definitions for i18n translation keys
// Generated from the resources structure in index.ts

import type { resources } from "./index";

// Extract the translation type from resources
type Resources = typeof resources;
type DefaultLocale = "en";

// Get the translation object type
type Translation = Resources[DefaultLocale]["translation"];

// Helper type to extract all possible keys from a nested object
// Handles both flat string keys (like "hero.title") and nested objects (like "form.error.name_full")
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? ObjectType[Key] extends string | number | boolean | null | undefined
      ? `${Key}`
      : `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key] & object>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Extract all translation keys as a union type
export type TranslationKey = NestedKeyOf<Translation>;

