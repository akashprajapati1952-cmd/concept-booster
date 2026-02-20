import React, { useState } from "react";
import { BookOpen, Loader2, ChevronRight } from "lucide-react";
import type { Language } from "./LanguageSelector";
import type { StudentProgress } from "../types/progress";

interface LearnTopicProps {
  language: Language;
  progress: StudentProgress;
  onUpdateProgress: (update: Partial<StudentProgress>) => void;
}

const popularTopics = [
  { emoji: "🔢", label: "Fractions", hindi: "भिन्न" },
  { emoji: "🌱", label: "Photosynthesis", hindi: "प्रकाश संश्लेषण" },
  { emoji: "⚡", label: "Electricity", hindi: "बिजली" },
  { emoji: "🌍", label: "Solar System", hindi: "सौर मंडल" },
  { emoji: "📐", label: "Geometry", hindi: "ज्यामिति" },
  { emoji: "🧪", label: "Acids & Bases", hindi: "अम्ल और क्षार" },
];

const getTopicContent = (topic: string, language: Language) => {
  const content: Record<Language, {
    definition: string;
    steps: string[];
    mistakes: string[];
    practice: { q: string; a: string }[];
  }> = {
    hindi: {
      definition: `${topic} एक महत्वपूर्ण concept है। आइए इसे बिल्कुल शुरू से समझते हैं। यह हमारी रोज़ की ज़िंदगी में बहुत काम आता है।`,
      steps: [
        "पहले definition समझो",
        "फिर example देखो",
        "छोटे-छोटे parts में बाँटो",
        "Practice problems solve करो",
      ],
      mistakes: [
        "Steps skip मत करो",
        "Formula रटने की बजाय समझो",
        "Practice ज़रूर करो",
      ],
      practice: [
        { q: `${topic} का सबसे आसान example क्या है?`, a: "रोज़ की ज़िंदगी में देखो!" },
        { q: `${topic} कहाँ use होता है?`, a: "हर जगह – घर में, बाजार में, प्रकृति में!" },
        { q: `${topic} को कैसे याद रखें?`, a: "story बनाओ और real life से जोड़ो!" },
      ],
    },
    hinglish: {
      definition: `${topic} ek important concept hai. Chalte hain bilkul start se samjhein. Yeh hamari daily life mein bahut kaam aata hai.`,
      steps: [
        "Pehle definition samjho",
        "Phir example dekho",
        "Chote parts mein todo",
        "Practice problems karo",
      ],
      mistakes: [
        "Steps kabhi skip mat karo",
        "Formula ratne ki jagah samjho",
        "Daily practice karo",
      ],
      practice: [
        { q: `${topic} ka sabse easy example kya hai?`, a: "Daily life mein dekho!" },
        { q: `${topic} kahan use hota hai?`, a: "Har jagah – ghar mein, market mein, nature mein!" },
        { q: `${topic} yaad kaise rakhein?`, a: "Story banao aur real life se jodo!" },
      ],
    },
    english: {
      definition: `${topic} is an important concept. Let's understand it from the very beginning. It is useful in our daily life too!`,
      steps: [
        "First understand the definition",
        "Then see a real example",
        "Break it into smaller parts",
        "Solve practice problems",
      ],
      mistakes: [
        "Never skip steps",
        "Understand formulas, don't just memorize",
        "Practice every day",
      ],
      practice: [
        { q: `What is the simplest example of ${topic}?`, a: "Look in your daily life!" },
        { q: `Where is ${topic} used in real life?`, a: "Everywhere – home, market, nature!" },
        { q: `How to remember ${topic}?`, a: "Make a story and connect to real life!" },
      ],
    },
  };
  return content[language];
};

const LearnTopic: React.FC<LearnTopicProps> = ({ language, progress, onUpdateProgress }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ReturnType<typeof getTopicContent> | null>(null);
  const [currentTopic, setCurrentTopic] = useState("");

  const handleLearn = async (t?: string) => {
    const topicToLearn = t || topic;
    if (!topicToLearn.trim()) return;
    setLoading(true);
    setContent(null);
    setCurrentTopic(topicToLearn);

    await new Promise((r) => setTimeout(r, 1600));
    setContent(getTopicContent(topicToLearn, language));
    setLoading(false);

    const topics = [...progress.topicsSearched];
    if (!topics.includes(topicToLearn)) topics.push(topicToLearn);
    onUpdateProgress({ topicsSearched: topics });
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="card-fun space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <div>
            <h3 className="font-baloo font-bold text-foreground">
              {language === "hindi" ? "Topic सीखो!" : language === "hinglish" ? "Topic Seekho!" : "Learn a Topic!"}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {language === "hindi" ? "कोई भी topic enter करो" : language === "hinglish" ? "Koi bhi topic likhein" : "Enter any topic to start"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            className="input-fun flex-1"
            placeholder={language === "hindi" ? "Topic लिखो..." : language === "hinglish" ? "Topic likhein..." : "Enter topic..."}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLearn()}
          />
          <button
            onClick={() => handleLearn()}
            disabled={loading || !topic.trim()}
            className="btn-hero px-4 touch-btn disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      {/* Popular Topics */}
      {!content && !loading && (
        <div className="slide-up">
          <p className="text-sm font-bold text-muted-foreground mb-3 px-1">
            {language === "hindi" ? "🔥 Popular Topics:" : language === "hinglish" ? "🔥 Popular Topics:" : "🔥 Popular Topics:"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {popularTopics.map((t) => (
              <button
                key={t.label}
                onClick={() => handleLearn(t.label)}
                className="card-colorful border-border hover:border-primary flex items-center gap-2 p-3 text-left touch-btn"
              >
                <span className="text-xl">{t.emoji}</span>
                <div>
                  <p className="font-bold text-foreground text-xs">{t.label}</p>
                  <p className="text-muted-foreground text-xs">{t.hindi}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          <div className="shimmer h-6 w-2/3" />
          <div className="shimmer h-32 w-full" />
          <div className="shimmer h-24 w-full" />
        </div>
      )}

      {/* Content */}
      {content && !loading && (
        <div className="space-y-3 bounce-in">
          <div className="flex items-center gap-2 px-1">
            <BookOpen size={18} className="text-primary" />
            <h3 className="font-baloo font-bold text-foreground text-lg">{currentTopic}</h3>
          </div>

          {/* Definition */}
          <div className="card-fun border-l-4 border-l-primary">
            <h4 className="font-bold text-foreground mb-2 text-sm">
              {language === "hindi" ? "📚 Definition:" : "📚 Definition:"}
            </h4>
            <p className="text-foreground text-sm font-medium leading-relaxed">{content.definition}</p>
          </div>

          {/* Steps */}
          <div className="card-fun bg-info-light border border-info/20">
            <h4 className="font-bold text-foreground mb-3 text-sm">
              {language === "hindi" ? "📋 Steps to Learn:" : language === "hinglish" ? "📋 Seekhne ke Steps:" : "📋 Steps to Learn:"}
            </h4>
            <ol className="space-y-2">
              {content.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground">
                  <span
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Common Mistakes */}
          <div className="card-fun bg-destructive/10 border border-destructive/20">
            <h4 className="font-bold text-foreground mb-2 text-sm">⚠️ Common Mistakes:</h4>
            <ul className="space-y-1">
              {content.mistakes.map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="text-destructive">✗</span> {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Questions */}
          <div className="card-fun">
            <h4 className="font-bold text-foreground mb-3 text-sm">
              ✏️ {language === "hindi" ? "Practice Questions:" : "Practice Questions:"}
            </h4>
            <div className="space-y-2">
              {content.practice.map((p, i) => (
                <PracticeQuestion key={i} index={i + 1} question={p.q} answer={p.a} language={language} />
              ))}
            </div>
          </div>

          <button
            onClick={() => { setContent(null); setTopic(""); setCurrentTopic(""); }}
            className="w-full text-center text-sm text-primary font-semibold py-2"
          >
            ← {language === "hindi" ? "दूसरा topic सीखें" : language === "hinglish" ? "Doosra topic seekho" : "Learn another topic"}
          </button>
        </div>
      )}
    </div>
  );
};

const PracticeQuestion = ({
  index,
  question,
  answer,
  language,
}: {
  index: number;
  question: string;
  answer: string;
  language: Language;
}) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="bg-card rounded-2xl p-3 border border-border">
      <p className="font-semibold text-foreground text-sm mb-2">
        Q{index}. {question}
      </p>
      {revealed ? (
        <p className="text-success font-bold text-sm">✅ {answer}</p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs text-secondary font-bold px-3 py-1.5 rounded-xl border border-secondary hover:bg-secondary-light transition-all touch-btn"
        >
          {language === "hindi" ? "उत्तर देखें" : language === "hinglish" ? "Answer Dekho" : "See Answer"}
        </button>
      )}
    </div>
  );
};

export default LearnTopic;
