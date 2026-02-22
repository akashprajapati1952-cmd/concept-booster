import React, { useState } from "react";
import { CheckCircle, XCircle, Loader2, Trophy, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Language } from "./LanguageSelector";
import type { StudentProgress } from "../types/progress";

interface PracticeProps {
  language: Language;
  progress: StudentProgress;
  onUpdateProgress: (update: Partial<StudentProgress>) => void;
}

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const suggestedTopics = [
  { emoji: "🔢", label: "Fractions" },
  { emoji: "🌱", label: "Photosynthesis" },
  { emoji: "⚡", label: "Electricity" },
  { emoji: "📐", label: "Geometry" },
  { emoji: "🧪", label: "Acids & Bases" },
  { emoji: "🌍", label: "Solar System" },
];

const Practice: React.FC<PracticeProps> = ({ language, progress, onUpdateProgress }) => {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleStartPractice = async (t?: string) => {
    const selectedTopic = t || topic;
    if (!selectedTopic.trim()) return;
    setLoading(true);
    setTopic(selectedTopic);

    try {
      const { data, error } = await supabase.functions.invoke("generate-questions", {
        body: { topic: selectedTopic, count: 5, language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const qs = data.questions as Question[];
      if (!qs || qs.length === 0) throw new Error("No questions generated");

      setQuestions(qs);
      setStarted(true);
      setCurrentQ(0);
      setSelected(null);
      setShowResult(false);
      setSessionScore({ correct: 0, wrong: 0 });
      setFinished(false);
    } catch (err: any) {
      console.error("Generate questions error:", err);
      toast.error(
        language === "hindi" ? "Questions generate नहीं हो पाए। फिर से try करें।"
          : language === "hinglish" ? "Questions generate nahi ho paye. Phir se try karo."
          : "Could not generate questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    const q = questions[currentQ];
    setSelected(index);
    setShowResult(true);
    const isCorrect = index === q.correct;

    const newSessionScore = {
      correct: sessionScore.correct + (isCorrect ? 1 : 0),
      wrong: sessionScore.wrong + (!isCorrect ? 1 : 0),
    };
    setSessionScore(newSessionScore);
    onUpdateProgress({
      correctAnswers: progress.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: progress.wrongAnswers + (!isCorrect ? 1 : 0),
    });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setQuestions([]);
    setTopic("");
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setSessionScore({ correct: 0, wrong: 0 });
    setFinished(false);
  };

  // Topic selection screen
  if (!started && !loading) {
    return (
      <div className="space-y-4">
        <div className="card-fun space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-baloo font-bold text-foreground">
                {language === "hindi" ? "Practice शुरू करो!" : language === "hinglish" ? "Practice Shuru Karo!" : "Start Practice!"}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {language === "hindi" ? "Topic चुनो और AI questions बनाएगा" : language === "hinglish" ? "Topic chuno, AI questions banayega" : "Pick a topic, AI will generate questions"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              className="input-fun flex-1"
              placeholder={language === "hindi" ? "Topic लिखो..." : language === "hinglish" ? "Topic likhein..." : "Enter topic..."}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStartPractice()}
            />
            <button
              onClick={() => handleStartPractice()}
              disabled={!topic.trim()}
              className="btn-hero px-4 touch-btn disabled:opacity-50 flex items-center gap-1"
            >
              <Sparkles size={16} />
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-muted-foreground mb-3 px-1">
            {language === "hindi" ? "🔥 Popular Topics:" : "🔥 Popular Topics:"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {suggestedTopics.map((t) => (
              <button
                key={t.label}
                onClick={() => handleStartPractice(t.label)}
                className="card-colorful border-border hover:border-primary flex items-center gap-2 p-3 text-left touch-btn"
              >
                <span className="text-xl">{t.emoji}</span>
                <p className="font-bold text-foreground text-xs">{t.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="card-fun text-center space-y-4">
        <Loader2 size={40} className="animate-spin mx-auto text-primary" />
        <p className="font-baloo font-bold text-foreground">
          {language === "hindi" ? "AI questions बना रहा है..." : language === "hinglish" ? "AI questions bana raha hai..." : "AI is generating questions..."}
        </p>
        <div className="space-y-3">
          <div className="shimmer h-8 w-full" />
          <div className="shimmer h-8 w-3/4" />
          <div className="shimmer h-8 w-1/2" />
        </div>
      </div>
    );
  }

  // Finished
  if (finished) {
    const percent = Math.round((sessionScore.correct / questions.length) * 100);
    return (
      <div className="card-fun text-center space-y-4 bounce-in">
        <div className="text-6xl">{percent >= 80 ? "🏆" : percent >= 60 ? "🌟" : "💪"}</div>
        <h3 className="font-baloo font-bold text-2xl text-foreground">
          {language === "hindi" ? "Session खत्म!" : language === "hinglish" ? "Session Khatam!" : "Session Done!"}
        </h3>
        <p className="text-sm text-muted-foreground font-semibold">
          {language === "hindi" ? `Topic: ${topic}` : `Topic: ${topic}`}
        </p>
        <div className="rounded-2xl p-4 text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
          <p className="text-4xl font-baloo font-extrabold">{percent}%</p>
          <p className="font-semibold text-sm opacity-90">
            {sessionScore.correct}/{questions.length} {language === "hindi" ? "सही" : "Correct"}
          </p>
        </div>
        <p className="text-foreground font-medium text-sm">
          {percent >= 80
            ? language === "hindi" ? "🎉 शाबाश! बहुत अच्छे!" : language === "hinglish" ? "🎉 Shabash! Bahut achha!" : "🎉 Excellent work!"
            : language === "hindi" ? "💪 और practice करो!" : language === "hinglish" ? "💪 Aur practice karo!" : "💪 Keep practicing!"}
        </p>
        <button onClick={handleRestart} className="btn-hero w-full py-3 font-bold touch-btn">
          {language === "hindi" ? "नया Topic चुनो! 🔄" : language === "hinglish" ? "Naya Topic Chuno! 🔄" : "New Topic! 🔄"}
        </button>
      </div>
    );
  }

  // Quiz
  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold text-muted-foreground">{currentQ + 1}/{questions.length}</p>
        <p className="text-sm font-bold text-success">✅ {sessionScore.correct} | ❌ {sessionScore.wrong}</p>
      </div>
      <div className="progress-fun h-3">
        <div className="progress-fun-fill h-3" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
      </div>

      <div className="card-fun border-l-4 border-l-accent">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-accent" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            {language === "hindi" ? "प्रश्न" : "Question"} {currentQ + 1}
          </p>
        </div>
        <p className="font-baloo font-bold text-foreground text-lg">{q.q}</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {q.options.map((opt, i) => {
          let style = "border-border bg-card text-foreground";
          if (selected !== null) {
            if (i === q.correct) style = "border-success bg-success-light text-success";
            else if (i === selected && selected !== q.correct)
              style = "border-destructive bg-destructive/10 text-destructive";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`card-colorful ${style} flex items-center gap-3 text-left font-semibold text-sm touch-btn`}
            >
              <span
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm border-2"
                style={{ borderColor: selected !== null && i === q.correct ? "hsl(var(--success))" : undefined }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {selected !== null && i === q.correct && <CheckCircle size={18} className="ml-auto text-success" />}
              {selected !== null && i === selected && selected !== q.correct && (
                <XCircle size={18} className="ml-auto text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`rounded-2xl p-4 slide-up ${selected === q.correct ? "bg-success-light border border-success/30" : "bg-destructive/10 border border-destructive/20"}`}>
          <p className="font-bold text-foreground text-sm">
            {selected === q.correct
              ? language === "hindi" ? "🎉 बहुत अच्छे! सही जवाब!" : language === "hinglish" ? "🎉 Bahut achha! Sahi jawab!" : "🎉 Excellent! Correct!"
              : language === "hindi" ? "😊 चिंता मत करो! सही जवाब है:" : language === "hinglish" ? "😊 Tension mat lo! Sahi jawab:" : "😊 Don't worry! Correct answer:"}
          </p>
          <p className="text-foreground/80 text-sm font-medium mt-1">{q.explanation}</p>
        </div>
      )}

      {showResult && (
        <button onClick={handleNext} className="btn-hero w-full py-3 font-bold touch-btn">
          {currentQ < questions.length - 1
            ? language === "hindi" ? "अगला सवाल →" : language === "hinglish" ? "Agla Question →" : "Next Question →"
            : language === "hindi" ? "Result देखो 🏆" : language === "hinglish" ? "Result Dekho 🏆" : "See Result 🏆"}
        </button>
      )}
    </div>
  );
};

export default Practice;
