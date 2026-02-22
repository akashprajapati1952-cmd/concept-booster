import React from "react";
import { LogOut, TrendingUp, AlertTriangle, BookOpen, CheckCircle, Clock, Lightbulb } from "lucide-react";
import type { StudentProgress } from "../types/progress";

interface ParentDashboardProps {
  mobile: string;
  fullName:string;
  studentProgress: StudentProgress;
  studentMobile: string;
  onLogout: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({
  mobile,
  fullName,
  studentProgress,
  studentMobile,
  onLogout,
}) => {
  const totalAnswered = studentProgress.correctAnswers + studentProgress.wrongAnswers;
  const accuracy = totalAnswered > 0
    ? Math.round((studentProgress.correctAnswers / totalAnswered) * 100)
    : 0;

  const masteryLevel = Math.min(
    100,
    Math.round((studentProgress.topicsSearched.length * 10 + studentProgress.correctAnswers * 5) / 1.5)
  );

  const recentTopics = studentProgress.topicsSearched.slice(-5);

  const suggestedRevision = [
    "Fractions – भिन्न",
    "Photosynthesis – प्रकाश संश्लेषण",
    "Geometry – ज्यामिति",
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">👨‍👩‍👧</span>
            <div>
              <p className="font-baloo font-bold text-foreground text-sm leading-tight">
                Parent Dashboard
              </p>
              <p className="text-xs text-muted-foreground font-medium"> {fullName} • Parent</p>
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
      </header>

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Student Info Banner */}
        <div
          className="rounded-3xl p-4 text-secondary-foreground"
          style={{ background: "var(--gradient-teal)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/20 flex items-center justify-center text-2xl">
              🎒
            </div>
            <div>
              <p className="font-baloo font-bold text-lg">Your Child's Progress</p>
              <p className="text-secondary-foreground/80 text-sm font-medium">
                Student: +91 {studentMobile || mobile}
              </p>
            </div>
          </div>

          {/* Mastery Bar */}
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-secondary-foreground/80 text-xs font-semibold">Mastery Level</p>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: "📚", label: "Topics Learned", value: studentProgress.topicsSearched.length, gradient: "var(--gradient-hero)" },
            { emoji: "🎯", label: "Accuracy", value: `${accuracy}%`, gradient: accuracy >= 80 ? "var(--gradient-green)" : accuracy >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))" },
            { emoji: "✅", label: "Correct", value: studentProgress.correctAnswers, gradient: "var(--gradient-green)" },
            { emoji: "🤔", label: "Questions Asked", value: studentProgress.questionsAsked, gradient: "var(--gradient-purple)" },
          ].map((stat) => (
            <div key={stat.label} className="card-fun text-center p-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
                style={{ background: stat.gradient }}
              >
                {stat.emoji}
              </div>
              <p className="font-baloo font-extrabold text-2xl text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-xs font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card-fun">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-primary" />
            <p className="font-bold text-foreground text-sm">Recent Activity</p>
          </div>
          {recentTopics.length > 0 ? (
            <div className="space-y-2">
              {recentTopics.map((topic, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-muted rounded-xl">
                  <CheckCircle size={16} className="text-success flex-shrink-0" />
                  <p className="text-foreground font-semibold text-sm">{topic}</p>
                  <span className="badge-success ml-auto">Searched</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-4xl mb-2">📖</p>
              <p className="text-muted-foreground font-medium text-sm">
                No activity yet. Encourage your child to start learning!
              </p>
            </div>
          )}
        </div>

        {/* Weak Topics */}
        <div className="card-fun">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-warning" />
            <p className="font-bold text-foreground text-sm">Areas Needing Attention</p>
          </div>
          {studentProgress.wrongAnswers > 2 ? (
            <div className="space-y-2">
              {["Fractions", "Number System"].map((t) => (
                <div key={t} className="flex items-center justify-between p-2 bg-warning-light rounded-xl">
                  <p className="font-semibold text-foreground text-sm">{t}</p>
                  <span className="badge-warning">Needs Practice</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-medium text-sm">
              🎉 Looking good! No weak areas detected yet.
            </p>
          )}
        </div>

        {/* Suggested Revision */}
        <div className="card-fun bg-info-light border border-info/20">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-info" />
            <p className="font-bold text-foreground text-sm">Suggested Revision Topics</p>
          </div>
          <div className="space-y-2">
            {suggestedRevision.map((topic) => (
              <div key={topic} className="flex items-center gap-2 p-2 bg-card rounded-xl">
                <BookOpen size={14} className="text-info flex-shrink-0" />
                <p className="text-foreground font-semibold text-sm">{topic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div
          className="rounded-3xl p-4 text-center text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <p className="text-2xl mb-1">💪</p>
          <p className="font-baloo font-bold text-lg">Keep Encouraging!</p>
          <p className="text-primary-foreground/80 text-sm font-medium">
            Regular practice for 20 minutes daily can improve grades significantly.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
