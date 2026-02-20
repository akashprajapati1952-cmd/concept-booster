import React, { useState } from "react";
import { X, Mail, Phone, Rocket, Heart } from "lucide-react";

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md card-fun slide-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="rounded-2xl p-4 mb-4 text-primary-foreground flex items-center justify-between"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            <div>
              <h3 className="font-baloo font-bold text-lg">Concept Booster AI</h3>
              <p className="text-primary-foreground/80 text-xs font-semibold">
                AI Builder Challenge – Builders of Bharat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <InfoCard emoji="👨‍💻" title="Creator" value="Akash Prajapati" />
          <InfoCard emoji="🎓" title="Student Level" value="Under Graduation" />
          <InfoCard emoji="🏆" title="Hackathon" value="AI Builder Challenge – Builders of Bharat" />

          {/* Purpose */}
          <div className="bg-info-light rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={16} className="text-info" />
              <p className="font-bold text-foreground text-sm">Purpose & Mission</p>
            </div>
            <p className="text-foreground/80 text-sm font-medium leading-relaxed">
              Support rural class 6–8 students with weak foundations. Make difficult topics easy
              using AI in simple Hindi and Hinglish. 🇮🇳
            </p>
          </div>

          {/* Target Users */}
          <div className="bg-success-light rounded-2xl p-4">
            <p className="font-bold text-foreground text-sm mb-1">🎯 Target Users</p>
            <p className="text-foreground/80 text-sm font-medium">
              Rural middle school students (Class 6–8)
            </p>
          </div>

          {/* Features */}
          <div className="bg-warning-light rounded-2xl p-4">
            <p className="font-bold text-foreground text-sm mb-2">⭐ Key Features</p>
            <ul className="space-y-1">
              {[
                "Simple AI explanations",
                "Doubt solving in Hindi/Hinglish",
                "Answer checking",
                "Parent progress tracking",
                "Step-by-step learning",
              ].map((f) => (
                <li key={f} className="text-sm text-foreground/80 font-medium flex items-center gap-2">
                  <span className="text-warning">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="card-fun space-y-2">
            <p className="font-bold text-foreground text-sm">📞 Contact</p>
            <a
              href="mailto:akash18151988@gmail.com"
              className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              <Mail size={14} />
              akash18151988@gmail.com
            </a>
            <a
              href="tel:9651073396"
              className="flex items-center gap-2 text-secondary font-semibold text-sm hover:underline"
            >
              <Phone size={14} />
              9651073396
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-hero w-full py-3 font-bold mt-4 touch-btn"
        >
          Close 🙏
        </button>
      </div>
    </div>
  );
};

const InfoCard = ({
  emoji,
  title,
  value,
}: {
  emoji: string;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border">
    <span className="text-2xl">{emoji}</span>
    <div>
      <p className="text-xs text-muted-foreground font-semibold">{title}</p>
      <p className="font-bold text-foreground text-sm">{value}</p>
    </div>
  </div>
);

export default AboutModal;
