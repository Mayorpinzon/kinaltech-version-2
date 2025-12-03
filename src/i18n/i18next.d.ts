// src/i18n/i18next.d.ts
// Type augmentation for i18next to enable strict translation key typing

import "react-i18next";
import type { TranslationKey } from "./types";

// Extend the default i18next module
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: {
        [K in TranslationKey]: string;
      };
    };
  }
}

// Extend react-i18next
declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: {
        [K in TranslationKey]: string;
      };
    };
  }
}

