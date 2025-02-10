import { ISO_TO_LANGUAGE_CODE, LanguageCode } from 'src/common/enum/common';

export class LanguageUtil {
  static mapISOToLanguageCode(isoCode: string): LanguageCode {
    const normalized = isoCode.toLowerCase();
    const mappedLanguage = ISO_TO_LANGUAGE_CODE[normalized];

    if (!mappedLanguage) {
      // Default to English if language not supported
      return LanguageCode.ENGLISH;
    }

    return mappedLanguage;
  }

  static isValidLanguageCode(code: string): boolean {
    return Object.values(LanguageCode).includes(code as LanguageCode);
  }
}
