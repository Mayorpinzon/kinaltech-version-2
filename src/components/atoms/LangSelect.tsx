//src/components/atoms/LangSelect.tsx
import { useTranslation } from 'react-i18next';
export default function LangSelect() {
    const { i18n } = useTranslation();
    return (
        <select aria-label="Language" className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-slate-800/80" value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="ja">JA</option>
        </select>
    );
}