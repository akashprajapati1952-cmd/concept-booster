import React, { useState, useRef } from "react";
import { Send, ImagePlus, Loader2, ChevronDown, Lightbulb, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Language } from "./LanguageSelector";
import type { StudentProgress } from "../types/progress";

interface DoubtBoxProps {
  language: Language;
  progress: StudentProgress;
  onUpdateProgress: (update: Partial<StudentProgress>) => void;
}

interface AIResponse {
  explanation: string;
  steps: string[];
  example: string;
  tip: string;
}

const DoubtBox: React.FC<DoubtBoxProps> = ({ language, progress, onUpdateProgress }) => {
  const [question, setQuestion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [simplified, setSimplified] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const placeholder = {
    hindi: "अपना सवाल यहाँ लिखें... (जैसे: भिन्न क्या है?)",
    hinglish: "Apna question yahan likhein... (jaise: Fraction kya hai?)",
    english: "Type your question here... (e.g., What is fraction?)",
  }[language];

  const handleAsk = async () => {
    if (!question.trim() && !imageFile) return;
    setLoading(true);
    setResponse(null);
    setSimplified(false);

    try {
      const { data, error } = await supabase.functions.invoke("ask-doubt", {
        body: { question: question.trim() || "Explain this image", language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResponse(data as AIResponse);

      // Update progress
      const topics = [...progress.topicsSearched];
      if (question.trim() && !topics.includes(question.trim())) {
        topics.push(question.trim());
      }
      onUpdateProgress({
        topicsSearched: topics,
        questionsAsked: progress.questionsAsked + 1,
      });
    } catch (err: any) {
      console.error("AI error:", err);
      toast.error(
        language === "hindi"
          ? "AI से जवाब नहीं मिला। फिर से कोशिश करें।"
          : language === "hinglish"
          ? "AI se jawab nahi mila. Phir se try karo."
          : "Could not get AI response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    if (!response) return;
    setLoading(true);
    try {
      const simplifyQ =
        language === "hindi"
          ? `इसे और सरल भाषा में समझाओ: ${response.explanation}`
          : language === "hinglish"
          ? `Isko aur simple mein samjhao: ${response.explanation}`
          : `Explain this even more simply for a young child: ${response.explanation}`;

      const { data, error } = await supabase.functions.invoke("ask-doubt", {
        body: { question: simplifyQ, language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResponse(data as AIResponse);
      setSimplified(true);
    } catch {
      toast.error("Could not simplify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Area */}
      <div className="card-fun space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤔</span>
          <div>
            <h3 className="font-baloo font-bold text-foreground">
              {language === "hindi" ? "अपना Doubt पूछो!" : language === "hinglish" ? "Apna Doubt Poochho!" : "Ask Your Doubt!"}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {language === "hindi" ? "कुछ भी पूछो, डरो मत!" : language === "hinglish" ? "Kuch bhi poochho!" : "Ask anything, no fear!"}
            </p>
          </div>
        </div>

        <textarea
          className="input-fun resize-none"
          rows={3}
          placeholder={placeholder}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* Image upload */}
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground font-semibold text-sm hover:border-primary hover:text-primary transition-all touch-btn"
          >
            <ImagePlus size={16} />
            {imageFile ? (
              <span className="text-success">✓ {imageFile.name.slice(0, 20)}</span>
            ) : (
              language === "hindi" ? "फ़ोटो अपलोड करें" : language === "hinglish" ? "Photo Upload Karo" : "Upload Image"
            )}
          </button>
          {imageFile && (
            <button onClick={() => setImageFile(null)} className="text-xs text-destructive font-semibold">
              Remove
            </button>
          )}
        </div>

        <button
          onClick={handleAsk}
          disabled={loading || (!question.trim() && !imageFile)}
          className="btn-hero w-full py-3 font-bold touch-btn flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {language === "hindi" ? "AI सोच रहा है..." : language === "hinglish" ? "AI soch raha hai..." : "AI is thinking..."}
            </>
          ) : (
            <>
              <Send size={18} />
              {language === "hindi" ? "पूछो!" : language === "hinglish" ? "Poochho!" : "Ask!"}
            </>
          )}
        </button>
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div className="space-y-3">
          <div className="shimmer h-24 w-full" />
          <div className="shimmer h-8 w-3/4" />
          <div className="shimmer h-8 w-1/2" />
        </div>
      )}

      {/* AI Response */}
      {response && !loading && (
        <div className="space-y-3 bounce-in">
          <div className="card-fun border-l-4 border-l-primary">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={20} className="text-accent" />
              <h4 className="font-baloo font-bold text-foreground">
                {language === "hindi" ? "समझाना:" : language === "hinglish" ? "Explanation:" : "Explanation:"}
              </h4>
            </div>
            <p className="text-foreground font-medium text-sm leading-relaxed">{response.explanation}</p>
          </div>

          {/* Steps */}
          <div className="card-fun bg-info-light border border-info/20">
            <h4 className="font-baloo font-bold text-foreground mb-3">
              {language === "hindi" ? "📋 Steps:" : "📋 Steps:"}
            </h4>
            <ol className="space-y-2">
              {response.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground">
                  <span
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary-foreground mt-0.5"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Example */}
          <div className="card-fun bg-success-light border border-success/20">
            <h4 className="font-baloo font-bold text-foreground mb-2">
              {language === "hindi" ? "🌟 उदाहरण:" : language === "hinglish" ? "🌟 Example:" : "🌟 Example:"}
            </h4>
            <p className="text-foreground font-medium text-sm">{response.example}</p>
          </div>

          {/* Tip */}
          <div className="card-fun bg-warning-light border border-warning/20">
            <p className="text-foreground font-semibold text-sm">{response.tip}</p>
          </div>

          {/* Simplify button */}
          {!simplified && (
            <button
              onClick={handleSimplify}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-secondary text-secondary font-bold touch-btn hover:bg-secondary-light transition-all"
            >
              <ChevronDown size={18} />
              {language === "hindi" ? "और आसान बताओ" : language === "hinglish" ? "Aur Simple Batao" : "Explain More Simply"}
            </button>
          )}

          {/* Ask another */}
          <button
            onClick={() => {
              setQuestion("");
              setResponse(null);
              setSimplified(false);
              setImageFile(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-muted-foreground font-semibold text-sm hover:text-foreground transition-colors"
          >
            <RotateCcw size={16} />
            {language === "hindi" ? "नया सवाल पूछें" : language === "hinglish" ? "Naya question poochho" : "Ask another question"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DoubtBox;
