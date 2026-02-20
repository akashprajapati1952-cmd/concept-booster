import React, { useState, useEffect } from "react";
import RoleSelect from "../components/RoleSelect";
import LoginScreen from "../components/LoginScreen";
import StudentDashboard from "../components/StudentDashboard";
import ParentDashboard from "../components/ParentDashboard";
import AboutModal from "../components/AboutModal";
import { defaultProgress } from "../types/progress";
import type { StudentProgress } from "../types/progress";

type Screen = "roleSelect" | "login" | "studentDashboard" | "parentDashboard";

const STORAGE_KEY = "concept_booster_data";

interface AppData {
  role: "student" | "parent" | null;
  mobile: string;
  studentMobile: string;
  progress: StudentProgress;
}

const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { role: null, mobile: "", studentMobile: "", progress: defaultProgress };
};

const saveData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("roleSelect");
  const [role, setRole] = useState<"student" | "parent" | null>(null);
  const [mobile, setMobile] = useState("");
  const [studentMobile, setStudentMobile] = useState("");
  const [progress, setProgress] = useState<StudentProgress>(defaultProgress);
  const [showAbout, setShowAbout] = useState(false);

  // Load persisted data
  useEffect(() => {
    const data = loadData();
    if (data.mobile && data.role) {
      setMobile(data.mobile);
      setRole(data.role);
      setProgress(data.progress || defaultProgress);
      setStudentMobile(data.studentMobile || data.mobile);
      setScreen(data.role === "student" ? "studentDashboard" : "parentDashboard");
    }
  }, []);

  const handleRoleSelect = (selectedRole: "student" | "parent") => {
    setRole(selectedRole);
    setScreen("login");
  };

  const handleLogin = (loginMobile: string) => {
    setMobile(loginMobile);

    // Load existing progress for this mobile
    const existingKey = `progress_${loginMobile}`;
    let existingProgress = defaultProgress;
    try {
      const raw = localStorage.getItem(existingKey);
      if (raw) existingProgress = JSON.parse(raw);
    } catch {}
    setProgress(existingProgress);

    if (role === "student") {
      setStudentMobile(loginMobile);
      const data: AppData = {
        role: "student",
        mobile: loginMobile,
        studentMobile: loginMobile,
        progress: existingProgress,
      };
      saveData(data);
      setScreen("studentDashboard");
    } else {
      // Parent: try to find linked student data
      // For demo: check if same number was registered as student
      const studentKey = `progress_${loginMobile}`;
      let linkedStudentMobile = loginMobile;
      try {
        const rawStudent = localStorage.getItem(studentKey);
        if (rawStudent) {
          existingProgress = JSON.parse(rawStudent);
          linkedStudentMobile = loginMobile;
        }
      } catch {}
      setStudentMobile(linkedStudentMobile);
      setProgress(existingProgress);
      const data: AppData = {
        role: "parent",
        mobile: loginMobile,
        studentMobile: linkedStudentMobile,
        progress: existingProgress,
      };
      saveData(data);
      setScreen("parentDashboard");
    }
  };

  const handleUpdateProgress = (update: Partial<StudentProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...update };
      // Compute mastery
      const masteryLevel = Math.min(
        100,
        Math.round((updated.topicsSearched.length * 10 + updated.correctAnswers * 5) / 1.5)
      );
      const final = { ...updated, masteryLevel };
      // Persist
      try {
        localStorage.setItem(`progress_${mobile}`, JSON.stringify(final));
        const appData = loadData();
        saveData({ ...appData, progress: final });
      } catch {}
      return final;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
    setMobile("");
    setStudentMobile("");
    setProgress(defaultProgress);
    setScreen("roleSelect");
  };

  return (
    <div className="relative min-h-screen">
      {/* Screens */}
      {screen === "roleSelect" && <RoleSelect onSelectRole={handleRoleSelect} />}

      {screen === "login" && role && (
        <LoginScreen
          role={role}
          onLogin={handleLogin}
          onBack={() => setScreen("roleSelect")}
        />
      )}

      {screen === "studentDashboard" && (
        <StudentDashboard
          mobile={mobile}
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onLogout={handleLogout}
        />
      )}

      {screen === "parentDashboard" && (
        <ParentDashboard
          mobile={mobile}
          studentProgress={progress}
          studentMobile={studentMobile}
          onLogout={handleLogout}
        />
      )}

      {/* About Us Button – fixed bottom-left */}
      {(screen === "studentDashboard" || screen === "parentDashboard" || screen === "roleSelect") && (
        <button
          onClick={() => setShowAbout(true)}
          className="fixed bottom-20 left-4 z-30 bg-card border border-border shadow-card rounded-2xl px-3 py-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors touch-btn"
          style={{ bottom: screen === "studentDashboard" ? "80px" : "16px" }}
        >
          ℹ️ About Us
        </button>
      )}

      {/* About Modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default Index;
