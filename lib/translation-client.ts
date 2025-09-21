import { Language } from "@/contexts/language-context"

const LIBRETRANSLATE_URL = "https://libretranslate.de/translate"

// Local cache for translations
const translationCache: Record<string, string> = {}

// Helper to build cache key
function getCacheKey(text: string, target: Language, source: Language = "en") {
	return `${source}:${target}:${text}`
}

// Fetch translation from LibreTranslate API
export async function fetchTranslation(text: string, target: Language, source: Language = "en"): Promise<string> {
	const cacheKey = getCacheKey(text, target, source)
	// Check localStorage first
	if (typeof window !== "undefined") {
		const cached = localStorage.getItem(cacheKey)
		if (cached) return cached
	}
	if (translationCache[cacheKey]) return translationCache[cacheKey]

	try {
		const res = await fetch(LIBRETRANSLATE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				q: text,
				source,
				target,
				format: "text",
			}),
		})
		if (!res.ok) throw new Error("Translation API error")
		const data = await res.json()
		const translated = data.translatedText || text
		translationCache[cacheKey] = translated
		if (typeof window !== "undefined") {
			localStorage.setItem(cacheKey, translated)
		}
		return translated
	} catch (err) {
		// Fallback to original text on error
		return text
	}
}

// useTranslation hook
import { useCallback, useState } from "react"

export function useTranslation(language: Language) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Translate a string, using cache and API
	const translate = useCallback(
		async (text: string, source: Language = "en") => {
			setLoading(true)
			setError(null)
			try {
				const translated = await fetchTranslation(text, language, source)
				setLoading(false)
				return translated
			} catch (err: any) {
				setError(err.message || "Translation failed")
				setLoading(false)
				return text
			}
		},
		[language]
	)

	return { translate, loading, error }
}
