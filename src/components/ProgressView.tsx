import React from "react";
import { TrendingUp, BookOpen, CheckCircle, XCircle, AlertTriangle, Star } from "lucide-react";
import type { StudentProgress } from "../types/progress";
import type { Language } from "./LanguageSelector";

interface ProgressViewProps {
  progress: StudentProgress;
  language: Language;
  mobile: string;
}

const ProgressView: React.FC<ProgressViewProps> = ({ progress, language, mobile }) => {
  const totalAnswered = progress.correctAnswers + progress.wrongAnswers;
  const accuracy = totalAnswered > 0 ? Math.round((progress.correctAnswers / totalAnswered) * 100) : 0;
  const masteryLevel = Math.min(
    100,
    Math.round((progress.topicsSearched.length * 10 + progress.correctAnswers * 5) / 1.5)
  );
  const stars = masteryLevel >= 80 ? 3 : masteryLevel >= 50 ? 2 : masteryLevel >= 20 ? 1 : 0;

  const t = {
    hindi: {
      title: "मेरी Progress",
      topics: "Topics सीखे",
      asked: "सवाल पूछे",
      correct: "सही जवाब",
      wrong: "गलत जवाब",
      accuracy: "Accuracy",
      mastery: "Mastery Level",
      weak: "Weak Topics",
      noWeak: "अभी कोई weak topic नहीं! 🎉",
      empty: "अभी तक कुछ नहीं! पहले कुछ सीखो। 😊",
    },
    hinglish: {
      title: "Meri Progress",
      topics: "Topics Seekhe",
      asked: "Questions Poochhe",
      correct: "Sahi Jawab",
      wrong: "Galat Jawab",
      accuracy: "Accuracy",
      mastery: "Mastery Level",
      weak: "Weak Topics",
      noWeak: "Abhi koi weak topic nahi! 🎉",
      empty: "Abhi kuch nahi! Pehle kuch seekho. 😊",
    },
    english: {
      title: "My Progress",
      topics: "Topics Learned",
      asked: "Questions Asked",
      correct: "Correct Answers",
      wrong: "Wrong Answers",
      accuracy: "Accuracy",
      mastery: "Mastery Level",
      weak: "Weak Topics",
      noWeak: "No weak topics yet! 🎉",
      empty: "Nothing yet! Start learning first. 😊",
    },
  }[language];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card-fun" style={{ background: "var(--gradient-teal)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary-foreground/70 text-sm font-semibold">+91 {mobile}</p>
            <h3 className="font-baloo font-bold text-secondary-foreground text-xl">{t.title}</h3>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={24}
                className={s <= stars ? "star-active fill-accent" : "text-secondary-foreground/30"}
                fill={s <= stars ? "hsl(var(--accent))" : "none"}
              />
            ))}
          </div>
        </div>

        {/* Mastery bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-secondary-foreground/80 text-xs font-semibold">{t.mastery}</p>
            <p className="text-secondary-foreground font-bold text-sm">{masteryLevel}%</p>
          </div>
          <div className="bg-secondary-foreground/20 rounded-full h-3">
            <div
              className="bg-accent rounded-full h-3 transition-all duration-700"
              style={{ width: `${masteryLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          emoji="📚"
          label={t.topics}
          value={progress.topicsSearched.length}
          color="var(--gradient-hero)"
        />
        <StatCard
          emoji="🤔"
          label={t.asked}
          value={progress.questionsAsked}
          color="var(--gradient-purple)"
        />
        <StatCard
          emoji="✅"
          label={t.correct}
          value={progress.correctAnswers}
          color="var(--gradient-green)"
        />
        <StatCard
          emoji="❌"
          label={t.wrong}
          value={progress.wrongAnswers}
          color="var(--gradient-teal)"
        />
      </div>

      {/* Accuracy */}
      {totalAnswered > 0 && (
        <div className="card-fun">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <p className="font-bold text-foreground">{t.accuracy}</p>
            </div>
            <span
              className={`font-baloo font-extrabold text-2xl ${
                accuracy >= 80 ? "text-success" : accuracy >= 60 ? "text-warning" : "text-destructive"
              }`}
            >
              {accuracy}%
            </span>
          </div>
          <div className="progress-fun h-4">
            <div
              className="h-4 rounded-full transition-all duration-700"
              style={{
                width: `${accuracy}%`,
                background:
                  accuracy >= 80
                    ? "var(--gradient-green)"
                    : accuracy >= 60
                    ? "hsl(var(--warning))"
                    : "hsl(var(--destructive))",
              }}
            />
          </div>
        </div>
      )}

      {/* Topics Searched */}
      {progress.topicsSearched.length > 0 ? (
        <div className="card-fun">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-secondary" />
            <p className="font-bold text-foreground text-sm">
              {language === "hindi" ? "हाल में सीखे Topics" : language === "hinglish" ? "Recent Topics" : "Recent Topics"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {progress.topicsSearched.slice(-8).map((topic) => (
              <span key={topic} className="badge-info text-xs px-3 py-1 rounded-xl">
                {topic}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-fun text-center py-6">
          <p className="text-4xl mb-2">📖</p>
          <p className="text-muted-foreground font-semibold text-sm">{t.empty}</p>
        </div>
      )}

      {/* Weak topics */}
      <div className="card-fun">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-warning" />
          <p className="font-bold text-foreground text-sm">{t.weak}</p>
        </div>
        {progress.wrongAnswers > 2 ? (
          <p className="text-sm text-foreground/80 font-medium">
            {language === "hindi"
              ? "इन पर ध्यान दो: Fractions, Number System"
              : language === "hinglish"
              ? "Inpar dhyan do: Fractions, Number System"
              : "Focus on: Fractions, Number System"}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground font-medium">{t.noWeak}</p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="card-fun text-center p-4">
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
      style={{ background: color }}
    >
      {emoji}
    </div>
    <p className="font-baloo font-extrabold text-2xl text-foreground">{value}</p>
    <p className="text-muted-foreground text-xs font-semibold">{label}</p>
  </div>
);

export default ProgressView;
