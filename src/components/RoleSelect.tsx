import React from "react";
import heroImg from "@/assets/hero-learning.png";

interface RoleSelectProps {
  onSelectRole: (role: "student" | "parent") => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ onSelectRole }) => {
  return (
    <div className="screen-card items-center justify-center px-4 py-8">
      {/* Logo / Header */}
      <div className="text-center mb-6 bounce-in">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-4xl">🚀</span>
          <h1 className="font-baloo text-3xl sm:text-4xl font-extrabold text-primary">
            Concept Booster AI
          </h1>
        </div>
        <p className="text-muted-foreground font-semibold text-sm sm:text-base">
          Class 6–8 के लिए Smart Learning! 📚
        </p>
      </div>

      {/* Hero Image */}
      <div className="w-full max-w-xs mx-auto mb-8 animate-float">
        <img
          src={heroImg}
          alt="Learning illustration"
          className="w-full rounded-3xl shadow-card"
        />
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-sm mx-auto slide-up">
        <h2 className="font-baloo text-xl font-bold text-center text-foreground mb-6">
          आप कौन हैं? Who are you?
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Student */}
          <button
            onClick={() => onSelectRole("student")}
            className="card-colorful border-primary bg-white flex flex-col items-center gap-3 p-6 touch-btn group"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
              style={{ background: "var(--gradient-hero)" }}
            >
              🎒
            </div>
            <div className="text-center">
              <p className="font-baloo font-bold text-foreground text-lg">Student</p>
              <p className="text-muted-foreground text-xs font-semibold">छात्र / छात्रा</p>
            </div>
          </button>

          {/* Parent */}
          <button
            onClick={() => onSelectRole("parent")}
            className="card-colorful border-secondary bg-white flex flex-col items-center gap-3 p-6 touch-btn group"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
              style={{ background: "var(--gradient-teal)" }}
            >
              👨‍👩‍👧
            </div>
            <div className="text-center">
              <p className="font-baloo font-bold text-foreground text-lg">Parent</p>
              <p className="text-muted-foreground text-xs font-semibold">माता / पिता</p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-medium">
          Select your role to get started • शुरू करने के लिए चुनें
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;
