/**
 * Bidirectional translation utilities for English <-> Bangla
 * Uses Google Translate free GTX API with MyMemory fallback.
 */

export const translateText = async (
  text: string,
  from: "en" | "bn",
  to: "en" | "bn"
): Promise<string> => {
  if (!text || !text.trim() || from === to) return text || "";

  // 1. Google Translate GTX Free API
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
        text.trim()
      )}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translated = data[0].map((item: [string]) => item[0]).join("");
        if (translated) return translated;
      }
    }
  } catch (error) {
    console.warn("Google Translate GTX error, attempting fallback...", error);
  }

  // 2. MyMemory Translated API Fallback
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text.trim()
      )}&langpair=${from}|${to}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch (fallbackError) {
    console.error("MyMemory translate error:", fallbackError);
  }

  return text;
};

/** Translate English text to Bangla */
export const translateToBangla = async (text: string): Promise<string> => {
  return translateText(text, "en", "bn");
};

/** Translate Bangla text to English */
export const translateToEnglish = async (text: string): Promise<string> => {
  return translateText(text, "bn", "en");
};
