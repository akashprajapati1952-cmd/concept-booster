import React, { useState } from "react";
import { LogOut, MessageCircle, BookOpen, Dumbbell, BarChart3, Globe } from "lucide-react";
import LanguageSelector, { Language } from "./LanguageSelector";
import DoubtBox from "./DoubtBox";
import LearnTopic from "./LearnTopic";
import Practice from "./Practice";
import ProgressView from "./ProgressView";
import type { StudentProgress } from "../types/progress";

interface StudentDashboardProps {
  mobile: string;
  progress: StudentProgress;
  onUpdateProgress: (update: Partial<StudentProgress>) => void;
  onLogout: () => void;
}

type Tab = "doubt" | "learn" | "practice" | "progress";

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  mobile,
  progress,
  onUpdateProgress,
  onLogout,
}) => {
  const [language, setLanguage] = useState<Language>("hinglish");
  const [activeTab, setActiveTab] = useState<Tab>("doubt");

  const tabs: { id: Tab; emoji: string; label: string; sublabel: string }[] = [
    { id: "doubt", emoji: "🤔", label: "Ask Doubt", sublabel: "Doubt Box" },
    { id: "learn", emoji: "📖", label: "Learn", sublabel: "Topic" },
    { id: "practice", emoji: "✏️", label: "Practice", sublabel: "Quiz" },
    { id: "progress", emoji: "📊", label: "Progress", sublabel: "My Stats" },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div>
              <p className="font-baloo font-bold text-foreground text-sm leading-tight">
                Concept Booster AI
              </p>
              <p className="text-xs text-muted-foreground font-medium">+91 {mobile} • Student 🎒</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold hover:text-destructive transition-colors touch-btn px-2"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Language Selector */}
        <LanguageSelector selected={language} onChange={setLanguage} />
      </header>

      {/* Welcome Banner */}
      <div
        className="mx-4 mt-4 rounded-3xl p-4 text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <p className="font-baloo font-bold text-lg">
          {language === "hindi"
            ? "नमस्ते! आज क्या सीखें? 🌟"
            : language === "hinglish"
            ? "Namaste! Aaj kya seekhein? 🌟"
            : "Hello! What shall we learn today? 🌟"}
        </p>
        <p className="text-primary-foreground/80 text-sm font-medium">
          {language === "hindi"
            ? `${progress.topicsSearched.length} topics सीखे • ${progress.correctAnswers} सही जवाब`
            : language === "hinglish"
            ? `${progress.topicsSearched.length} topics seekhe • ${progress.correctAnswers} sahi jawab`
            : `${progress.topicsSearched.length} topics learned • ${progress.correctAnswers} correct answers`}
        </p>
      </div>

      {/* Content Area */}
      <main className="flex-1 px-4 py-4">
        {activeTab === "doubt" && (
          <DoubtBox language={language} progress={progress} onUpdateProgress={onUpdateProgress} />
        )}
        {activeTab === "learn" && (
          <LearnTopic language={language} progress={progress} onUpdateProgress={onUpdateProgress} />
        )}
        {activeTab === "practice" && (
          <Practice language={language} progress={progress} onUpdateProgress={onUpdateProgress} />
        )}
        {activeTab === "progress" && (
          <ProgressView progress={progress} language={language} mobile={mobile} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-card border-t border-border px-2 py-2 grid grid-cols-4 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-2xl transition-all duration-200 touch-btn ${
              activeTab === tab.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={
              activeTab === tab.id ? { background: "var(--gradient-hero)" } : {}
            }
          >
            <span className="text-xl">{tab.emoji}</span>
            <span className="text-xs font-bold leading-tight">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StudentDashboard;
