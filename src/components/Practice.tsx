import React, { useState } from "react";
import { CheckCircle, XCircle, Loader2, Trophy } from "lucide-react";
import type { Language } from "./LanguageSelector";
import type { StudentProgress } from "../types/progress";

interface PracticeProps {
  language: Language;
  progress: StudentProgress;
  onUpdateProgress: (update: Partial<StudentProgress>) => void;
}

const questions: Record<Language, { q: string; options: string[]; correct: number; explanation: string }[]> = {
  hindi: [
    {
      q: "1/2 + 1/4 = ?",
      options: ["1/2", "3/4", "2/6", "1/4"],
      correct: 1,
      explanation: "1/2 = 2/4, तो 2/4 + 1/4 = 3/4 ✅",
    },
    {
      q: "पौधों में भोजन बनाने की प्रक्रिया क्या कहलाती है?",
      options: ["श्वसन", "प्रकाश संश्लेषण", "पाचन", "जनन"],
      correct: 1,
      explanation: "Photosynthesis = प्रकाश संश्लेषण – पौधे इसी से खाना बनाते हैं ✅",
    },
    {
      q: "5 × 5 = ?",
      options: ["10", "15", "25", "30"],
      correct: 2,
      explanation: "5 × 5 = 25 ✅ (5 को 5 बार जोड़ो)",
    },
    {
      q: "त्रिभुज के कितने कोण होते हैं?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      explanation: "त्रिभुज = 3 भुजाएँ और 3 कोण ✅",
    },
    {
      q: "पृथ्वी से सूर्य की दूरी लगभग कितनी है?",
      options: ["15 करोड़ km", "1 करोड़ km", "50 करोड़ km", "5 करोड़ km"],
      correct: 0,
      explanation: "पृथ्वी से सूर्य ≈ 15 करोड़ किलोमीटर दूर है ✅",
    },
  ],
  hinglish: [
    {
      q: "1/2 + 1/4 = ?",
      options: ["1/2", "3/4", "2/6", "1/4"],
      correct: 1,
      explanation: "1/2 = 2/4 hai, toh 2/4 + 1/4 = 3/4 ✅",
    },
    {
      q: "Plants mein khana banane ki process ko kya kehte hain?",
      options: ["Respiration", "Photosynthesis", "Digestion", "Reproduction"],
      correct: 1,
      explanation: "Photosynthesis – plants isi se apna khana banate hain ✅",
    },
    {
      q: "5 × 5 = ?",
      options: ["10", "15", "25", "30"],
      correct: 2,
      explanation: "5 × 5 = 25 ✅ (5 ko 5 baar jodo)",
    },
    {
      q: "Triangle ke kitne angle hote hain?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      explanation: "Triangle = 3 sides aur 3 angles ✅",
    },
    {
      q: "Earth se Sun ki distance kitni hai?",
      options: ["15 crore km", "1 crore km", "50 crore km", "5 crore km"],
      correct: 0,
      explanation: "Earth se Sun ≈ 15 crore kilometer door hai ✅",
    },
  ],
  english: [
    {
      q: "1/2 + 1/4 = ?",
      options: ["1/2", "3/4", "2/6", "1/4"],
      correct: 1,
      explanation: "1/2 = 2/4, so 2/4 + 1/4 = 3/4 ✅",
    },
    {
      q: "What is the process of making food in plants called?",
      options: ["Respiration", "Photosynthesis", "Digestion", "Reproduction"],
      correct: 1,
      explanation: "Photosynthesis – that's how plants make their food ✅",
    },
    {
      q: "5 × 5 = ?",
      options: ["10", "15", "25", "30"],
      correct: 2,
      explanation: "5 × 5 = 25 ✅ (add 5 five times)",
    },
    {
      q: "How many angles does a triangle have?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      explanation: "Triangle = 3 sides and 3 angles ✅",
    },
    {
      q: "What is the approximate distance from Earth to Sun?",
      options: ["150 million km", "10 million km", "500 million km", "50 million km"],
      correct: 0,
      explanation: "Earth to Sun ≈ 150 million kilometers ✅",
    },
  ],
};

const Practice: React.FC<PracticeProps> = ({ language, progress, onUpdateProgress }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);

  const qs = questions[language];
  const q = qs[currentQ];

  const handleSelect = (index: number) => {
    if (selected !== null) return;
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
    if (currentQ < qs.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setSessionScore({ correct: 0, wrong: 0 });
    setFinished(false);
  };

  const accuracy = progress.correctAnswers + progress.wrongAnswers > 0
    ? Math.round((progress.correctAnswers / (progress.correctAnswers + progress.wrongAnswers)) * 100)
    : 0;

  if (finished) {
    const percent = Math.round((sessionScore.correct / qs.length) * 100);
    return (
      <div className="card-fun text-center space-y-4 bounce-in">
        <div className="text-6xl">{percent >= 80 ? "🏆" : percent >= 60 ? "🌟" : "💪"}</div>
        <h3 className="font-baloo font-bold text-2xl text-foreground">
          {language === "hindi" ? "Session खत्म!" : language === "hinglish" ? "Session Khatam!" : "Session Done!"}
        </h3>
        <div
          className="rounded-2xl p-4 text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <p className="text-4xl font-baloo font-extrabold">{percent}%</p>
          <p className="font-semibold text-sm opacity-90">
            {sessionScore.correct}/{qs.length} {language === "hindi" ? "सही" : "Correct"}
          </p>
        </div>
        <p className="text-foreground font-medium text-sm">
          {percent >= 80
            ? language === "hindi" ? "🎉 शाबाश! बहुत अच्छे!" : language === "hinglish" ? "🎉 Shabash! Bahut achha!" : "🎉 Excellent work!"
            : language === "hindi" ? "💪 और practice करो, तुम कर सकते हो!" : language === "hinglish" ? "💪 Aur practice karo, tum kar sakte ho!" : "💪 Keep practicing, you can do it!"}
        </p>
        <button onClick={handleRestart} className="btn-hero w-full py-3 font-bold touch-btn">
          {language === "hindi" ? "फिर से खेलो! 🔄" : language === "hinglish" ? "Phir se khelo! 🔄" : "Play Again! 🔄"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold text-muted-foreground">
          {currentQ + 1}/{qs.length}
        </p>
        <p className="text-sm font-bold text-success">
          ✅ {sessionScore.correct} | ❌ {sessionScore.wrong}
        </p>
      </div>
      <div className="progress-fun h-3">
        <div
          className="progress-fun-fill h-3"
          style={{ width: `${((currentQ) / qs.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card-fun border-l-4 border-l-accent">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-accent" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            {language === "hindi" ? "प्रश्न" : "Question"} {currentQ + 1}
          </p>
        </div>
        <p className="font-baloo font-bold text-foreground text-lg">{q.q}</p>
      </div>

      {/* Options */}
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
                style={{
                  borderColor: selected !== null && i === q.correct ? "hsl(var(--success))" : undefined,
                }}
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

      {/* Result explanation */}
      {showResult && (
        <div
          className={`rounded-2xl p-4 slide-up ${selected === q.correct ? "bg-success-light border border-success/30" : "bg-destructive/10 border border-destructive/20"}`}
        >
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
          {currentQ < qs.length - 1
            ? language === "hindi" ? "अगला सवाल →" : language === "hinglish" ? "Agla Question →" : "Next Question →"
            : language === "hindi" ? "Result देखो 🏆" : language === "hinglish" ? "Result Dekho 🏆" : "See Result 🏆"}
        </button>
      )}
    </div>
  );
};

export default Practice;
