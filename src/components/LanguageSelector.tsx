import React from "react";
import { Globe } from "lucide-react";

export type Language = "hindi" | "hinglish" | "english";

interface LanguageSelectorProps {
  selected: Language;
  onChange: (lang: Language) => void;
}

const languages: { id: Language; label: string; sublabel: string; emoji: string }[] = [
  { id: "hindi", label: "हिंदी", sublabel: "Hindi", emoji: "🇮🇳" },
  { id: "hinglish", label: "Hinglish", sublabel: "हिंग्लिश", emoji: "✨" },
  { id: "english", label: "English", sublabel: "Simple English", emoji: "📖" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <Globe size={16} className="text-muted-foreground flex-shrink-0" />
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onChange(lang.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-sm transition-all duration-200 touch-btn ${
            selected === lang.id
              ? "text-primary-foreground shadow-primary"
              : "bg-card text-muted-foreground border border-border hover:border-primary/50"
          }`}
          style={selected === lang.id ? { background: "var(--gradient-hero)" } : {}}
        >
          <span>{lang.emoji}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
