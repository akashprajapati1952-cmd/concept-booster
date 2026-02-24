import React, { useState } from "react";
import { ArrowLeft, User, Calendar, Phone, RefreshCw } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";

interface LoginScreenProps {
  role: "student" | "parent";
  onLogin: (data: { fullName: string; dob: string; mobile: string }) => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ role, onLogin, onBack, loading = false, error: externalError }) => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const isStudent = role === "student";
  const gradientStyle = isStudent ? "var(--gradient-hero)" : "var(--gradient-teal)";
  const emoji = isStudent ? "🎒" : "👨‍👩‍👧";

  const displayError = externalError || error;

  const handleSubmit = () => {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError("Please enter full name");
      return;
    }
    if (trimmedName.length > 100) {
      setError("Name must be less than 100 characters");
      return;
    }
    if (!dob) {
      setError("Please select date of birth");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    onLogin({ fullName: trimmedName, dob, mobile });
  };

  const nameLabel = isStudent ? "Full Name" : "Child's Full Name";
  const dobLabel = isStudent ? "Date of Birth" : "Child's Date of Birth";
  const mobileLabel = isStudent ? "Mobile Number" : "Child's Mobile Number";
  const namePlaceholder = isStudent ? "Enter your full name" : "Enter your child's name";
  const mobilePlaceholder = isStudent ? "10 digit number" : "Child's 10 digit number";

  return (
    <div className="screen-card justify-center px-4 py-8 max-w-md mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 text-muted-foreground font-semibold mb-6 touch-btn hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8 bounce-in">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-primary"
          style={{ background: gradientStyle }}
        >
          {emoji}
        </div>
        <h2 className="font-baloo text-2xl font-bold text-foreground">
          {isStudent ? "Student Login" : "Parent Login"}
        </h2>
        <p className="text-muted-foreground text-sm font-medium mt-1">
          {isStudent ? "छात्र लॉगिन" : "माता/पिता लॉगिन"}
        </p>
      </div>

      <div className="w-full slide-up">
        <div className="card-fun space-y-4">
          {/* Full Name */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <User size={16} className="text-primary" />
              <label className="font-bold text-foreground text-sm">{nameLabel}</label>
            </div>
            <input
              type="text"
              className="input-fun w-full"
              placeholder={namePlaceholder}
              value={fullName}
              maxLength={100}
              onChange={(e) => { setFullName(e.target.value); setError(""); }}
            />
          </div>

          {/* DOB */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar size={16} className="text-primary" />
              <label className="font-bold text-foreground text-sm">{dobLabel}</label>
            </div>
            <input
              type="date"
              className="input-fun w-full"
              value={dob}
              onChange={(e) => { setDob(e.target.value); setError(""); }}
            />
          </div>

          {/* Mobile */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Phone size={16} className="text-primary" />
              <label className="font-bold text-foreground text-sm">{mobileLabel}</label>
            </div>
            <div className="flex gap-2">
              <div className="input-fun w-14 text-center font-bold text-muted-foreground flex-shrink-0">
                +91
              </div>
              <input
                type="tel"
                inputMode="numeric"
                className="input-fun flex-1"
                placeholder={mobilePlaceholder}
                value={mobile}
                maxLength={10}
                onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
              />
            </div>
          </div>

          {displayError && (
            <p className="text-destructive text-sm font-semibold flex items-center gap-1">
              ⚠️ {displayError}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !fullName.trim() || !dob || mobile.length !== 10}
            className="btn-hero w-full py-3.5 text-base font-bold touch-btn disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: loading ? undefined : gradientStyle }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw size={18} className="animate-spin" />
                {isStudent ? "Logging in..." : "Finding student..."}
              </span>
            ) : (
              isStudent ? "Login / Register 🚀" : "View Child's Progress 📊"
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground font-medium">
            {isStudent
              ? "Name + DOB + Mobile = आपकी unique पहचान"
              : "अपने बच्चे की details डालकर progress देखें"}
          </p>

          

          
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
