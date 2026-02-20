import React, { useState, useRef } from "react";
import { Send, ImagePlus, Loader2, ChevronDown, Lightbulb, RotateCcw } from "lucide-react";
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

const getAIResponse = (question: string, language: Language): AIResponse => {
  const q = question.toLowerCase();

  const responses: Record<string, Record<Language, AIResponse>> = {
    fraction: {
      hindi: {
        explanation:
          "भिन्न (Fraction) एक संख्या है जो पूरे का एक हिस्सा दर्शाती है। जैसे अगर हम एक सेब को 4 टुकड़ों में काटें और 1 टुकड़ा लें, तो वह 1/4 भिन्न है।",
        steps: [
          "ऊपर की संख्या को अंश (Numerator) कहते हैं",
          "नीचे की संख्या को हर (Denominator) कहते हैं",
          "अंश ÷ हर = दशमलव संख्या",
          "जोड़ने के लिए हर को बराबर करें",
        ],
        example: "🍕 Pizza: 8 टुकड़े हैं, तुमने 3 खाए → तुम्हारा हिस्सा = 3/8",
        tip: "💡 याद रखो: हर कभी 0 नहीं हो सकता!",
      },
      hinglish: {
        explanation:
          "Fraction ek number hai jo ek cheez ka part batata hai. Jaise agar ek pizza ke 4 pieces hain aur tumne 1 khaya, toh tumhara fraction = 1/4 hai!",
        steps: [
          "Upar wala number = Numerator (kitna liya)",
          "Neeche wala number = Denominator (total kitne parts)",
          "Jab hum add karte hain → pehle denominator same karo",
          "Multiply karne mein seedha numerator × numerator",
        ],
        example: "🍎 Ek apple ke 2 pieces karo, ek piece lo → 1/2 fraction hai!",
        tip: "💡 Trick: Denominator kabhi zero nahi hoga!",
      },
      english: {
        explanation:
          "A fraction shows a part of a whole thing. The top number is how many parts you have. The bottom number is how many total parts there are.",
        steps: [
          "Top number = Numerator (your parts)",
          "Bottom number = Denominator (total parts)",
          "To add: make denominators the same first",
          "To multiply: multiply top × top, bottom × bottom",
        ],
        example: "🍕 Pizza cut into 8 slices, you eat 3 = 3/8 of pizza eaten!",
        tip: "💡 Remember: Denominator can never be zero!",
      },
    },
    photosynthesis: {
      hindi: {
        explanation:
          "प्रकाश संश्लेषण (Photosynthesis) वह प्रक्रिया है जिसमें पौधे सूर्य के प्रकाश का उपयोग करके खाना बनाते हैं। पत्तियों में हरा पदार्थ (Chlorophyll) होता है जो यह काम करता है।",
        steps: [
          "पौधा पत्तियों से सूर्य का प्रकाश लेता है",
          "जड़ों से पानी (H₂O) लेता है",
          "हवा से CO₂ (Carbon Dioxide) लेता है",
          "Chlorophyll की मदद से Glucose बनाता है और O₂ छोड़ता है",
        ],
        example: "🌱 जैसे हम खाना पकाते हैं, पौधे सूरज की रोशनी से खाना पकाते हैं!",
        tip: "💡 Formula: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂",
      },
      hinglish: {
        explanation:
          "Photosynthesis ek process hai jisme plants suraj ki roshni se apna khana banate hain. Leaves mein hara color Chlorophyll hota hai jo yeh kaam karta hai.",
        steps: [
          "Plant leaves se sunlight absorb karta hai",
          "Roots se paani leta hai",
          "Hawa se CO₂ leta hai",
          "In sab se glucose (sugar) banata hai aur oxygen release karta hai",
        ],
        example: "🌿 Seedha samjho: Plant = Chef, Sunlight = Gas, CO₂+Water = Ingredients, Glucose = Khana!",
        tip: "💡 Isliye hare patte important hain – ye humein oxygen dete hain!",
      },
      english: {
        explanation:
          "Photosynthesis is how plants make their own food using sunlight. The green color in leaves (Chlorophyll) helps capture sunlight energy.",
        steps: [
          "Leaves capture sunlight",
          "Roots absorb water (H₂O)",
          "Leaves take in CO₂ from air",
          "Using light energy → make glucose + release oxygen",
        ],
        example: "🌱 Think of leaves as solar-powered kitchens making food from sunlight!",
        tip: "💡 Simple formula: Sun + Water + CO₂ → Food + Oxygen",
      },
    },
  };

  // Detect topic
  const topic = q.includes("fraction") || q.includes("भिन्न") || q.includes("भिन्")
    ? "fraction"
    : q.includes("photo") || q.includes("प्रकाश") || q.includes("plant")
    ? "photosynthesis"
    : null;

  if (topic && responses[topic]) {
    return responses[topic][language];
  }

  // Generic response
  const generic: Record<Language, AIResponse> = {
    hindi: {
      explanation: `"${question}" के बारे में – यह एक अच्छा सवाल है! आइए इसे आसान तरीके से समझते हैं। इस topic को step-by-step समझने की कोशिश करें।`,
      steps: ["पहले basic concept समझें", "फिर example देखें", "Practice करें", "अगर doubt हो तो फिर पूछें"],
      example: "🌟 Real life में देखो – हर चीज़ में Math और Science छुपी है!",
      tip: "💡 हमेशा सवाल पूछो – यही सीखने का सबसे अच्छा तरीका है!",
    },
    hinglish: {
      explanation: `"${question}" ke baare mein – bahut achha question hai! Chalte hain step by step samjhein. Pehle basic clear karein.`,
      steps: ["Basic concept pehle", "Phir example dekho", "Practice karo", "Doubt ho toh poochho"],
      example: "🌟 Real life mein dekho – sab mein Math aur Science chhupa hai!",
      tip: "💡 Questions poochho – yehi sabse best tarika hai sikhne ka!",
    },
    english: {
      explanation: `Great question about "${question}"! Let's break it down step by step in simple words. Understanding basics first makes everything easier.`,
      steps: ["Start with the basic idea", "Look at a real example", "Try to solve", "Ask again if confused"],
      example: "🌟 Look around you – Math and Science are everywhere in real life!",
      tip: "💡 Always ask questions – that's the best way to learn!",
    },
  };

  return generic[language];
};

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

    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1800));
    const aiResp = getAIResponse(question || "general concept", language);
    setResponse(aiResp);
    setLoading(false);

    // Update progress
    const topics = [...progress.topicsSearched];
    if (question.trim() && !topics.includes(question.trim())) {
      topics.push(question.trim());
    }
    onUpdateProgress({
      topicsSearched: topics,
      questionsAsked: progress.questionsAsked + 1,
    });
  };

  const handleSimplify = async () => {
    if (!response) return;
    setSimplified(true);
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
          {/* Main explanation */}
          <div className="card-fun border-l-4 border-l-primary">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={20} className="text-accent" />
              <h4 className="font-baloo font-bold text-foreground">
                {language === "hindi" ? "समझाना:" : language === "hinglish" ? "Explanation:" : "Explanation:"}
              </h4>
            </div>
            <p className="text-foreground font-medium text-sm leading-relaxed">
              {simplified
                ? (language === "hindi"
                    ? "✨ सरल शब्दों में: " + response.explanation.split(" ").slice(0, 15).join(" ") + "..."
                    : language === "hinglish"
                    ? "✨ Aur simple mein: " + response.explanation.split(" ").slice(0, 15).join(" ") + "..."
                    : "✨ Even simpler: " + response.explanation.split(" ").slice(0, 15).join(" ") + "...")
                : response.explanation}
            </p>
          </div>

          {/* Steps */}
          <div className="card-fun bg-info-light border border-info/20">
            <h4 className="font-baloo font-bold text-foreground mb-3">
              {language === "hindi" ? "📋 Steps:" : language === "hinglish" ? "📋 Steps:" : "📋 Steps:"}
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
