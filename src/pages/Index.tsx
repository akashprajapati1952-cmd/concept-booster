import React, { useState, useEffect } from "react";
import RoleSelect from "../components/RoleSelect";
import LoginScreen from "../components/LoginScreen";
import StudentDashboard from "../components/StudentDashboard";
import ParentDashboard from "../components/ParentDashboard";
import AboutModal from "../components/AboutModal";
import { defaultProgress } from "../types/progress";
import type { StudentProgress } from "../types/progress";
import { supabase } from "@/integrations/supabase/client";

type Screen = "roleSelect" | "login" | "studentDashboard" | "parentDashboard";

interface StudentData {
  id: string;
  fullName: string;
  dob: string;
  mobile: string;
}

interface StudentRow {
  id: string;
  full_name: string;
  dob: string;
  mobile: string;
  topics_searched: string[] | null;
  questions_asked: number | null;
  correct_answers: number | null;
  wrong_answers: number | null;
  weak_topics: string[] | null;
  mastery_level: number | null;
}

const rowToProgress = (row: StudentRow): StudentProgress => ({
  topicsSearched: row.topics_searched || [],
  questionsAsked: row.questions_asked || 0,
  correctAnswers: row.correct_answers || 0,
  wrongAnswers: row.wrong_answers || 0,
  weakTopics: row.weak_topics || [],
  masteryLevel: row.mastery_level || 0,
});

const Index = () => {
  const [screen, setScreen] = useState<Screen>("roleSelect");
  const [role, setRole] = useState<"student" | "parent" | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [progress, setProgress] = useState<StudentProgress>(defaultProgress);
  const [showAbout, setShowAbout] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Check for Google OAuth session on mount
  useEffect(() => {
    let handled = false;

    const handleGoogleUser = async (userId: string, metadata: any) => {
      if (handled) return;
      handled = true;

      const savedRole = localStorage.getItem("pending_google_role") as "student" | "parent" | null;
      localStorage.removeItem("pending_google_role");
      const effectiveRole = savedRole || "student";

      const name = metadata?.full_name || metadata?.name || "Google User";
      const mobileKey = `google_${userId.slice(0, 8)}`;

      const { data: rows } = await (supabase as any)
        .from("students")
        .select("*")
        .eq("mobile", mobileKey)
        .ilike("full_name", name.toLowerCase());

      let student: StudentRow | null = rows && rows.length > 0 ? rows[0] : null;

      if (!student) {
        if (effectiveRole === "parent") {
          setLoginError("No student found with this Google account. पहले student के रूप में register करें।");
          setRole("parent");
          setScreen("login");
          return;
        }
        const { data: inserted } = await (supabase as any)
          .from("students")
          .insert({ full_name: name, dob: "2000-01-01", mobile: mobileKey })
          .select()
          .single();
        student = inserted;
      }

      if (student) {
        setStudentData({ id: student.id, fullName: student.full_name, dob: student.dob, mobile: student.mobile });
        setProgress(rowToProgress(student));
        setRole(effectiveRole);
        setScreen(effectiveRole === "parent" ? "parentDashboard" : "studentDashboard");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        handleGoogleUser(session.user.id, session.user.user_metadata);
      }
    });

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleGoogleUser(session.user.id, session.user.user_metadata);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRoleSelect = (selectedRole: "student" | "parent") => {
    setRole(selectedRole);
    setLoginError("");
    setScreen("login");
  };

  const handleLogin = async (data: { fullName: string; dob: string; mobile: string }) => {
    setLoginLoading(true);
    setLoginError("");

    try {
      const normalizedName = data.fullName.trim().toLowerCase();

      // Use type assertion for newly created table not yet in generated types
      const { data: rows, error: fetchErr } = await (supabase as any)
        .from("students")
        .select("*")
        .eq("mobile", data.mobile)
        .eq("dob", data.dob)
        .ilike("full_name", normalizedName);

      if (fetchErr) throw fetchErr;

      const existing: StudentRow | null = rows && rows.length > 0 ? rows[0] : null;

      if (role === "student") {
        if (existing) {
          setStudentData({ id: existing.id, fullName: existing.full_name, dob: existing.dob, mobile: existing.mobile });
          setProgress(rowToProgress(existing));
          setScreen("studentDashboard");
        } else {
          // Register new student
          const { data: inserted, error: insertErr } = await (supabase as any)
            .from("students")
            .insert({ full_name: data.fullName.trim(), dob: data.dob, mobile: data.mobile })
            .select()
            .single();

          if (insertErr) throw insertErr;

          setStudentData({ id: inserted.id, fullName: inserted.full_name, dob: inserted.dob, mobile: inserted.mobile });
          setProgress(defaultProgress);
          setScreen("studentDashboard");
        }
      } else {
        // Parent: must find existing student
        if (!existing) {
          setLoginError("No student found with these details. कृपया सही details डालें।");
          setLoginLoading(false);
          return;
        }

        setStudentData({ id: existing.id, fullName: existing.full_name, dob: existing.dob, mobile: existing.mobile });
        setProgress(rowToProgress(existing));
        setScreen("parentDashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateProgress = async (update: Partial<StudentProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...update };
      const masteryLevel = Math.min(
        100,
        Math.round((updated.topicsSearched.length * 10 + updated.correctAnswers * 5) / 1.5)
      );
      const final = { ...updated, masteryLevel };

      if (studentData?.id) {
        (supabase as any)
          .from("students")
          .update({
            topics_searched: final.topicsSearched,
            questions_asked: final.questionsAsked,
            correct_answers: final.correctAnswers,
            wrong_answers: final.wrongAnswers,
            weak_topics: final.weakTopics,
            mastery_level: final.masteryLevel,
          })
          .eq("id", studentData.id)
          .then(({ error }: any) => {
            if (error) console.error("Failed to save progress:", error);
          });
      }

      return final;
    });
  };

  const handleLogout = () => {
    setRole(null);
    setStudentData(null);
    setProgress(defaultProgress);
    setLoginError("");
    setScreen("roleSelect");
  };

  return (
    <div className="relative min-h-screen">
      {screen === "roleSelect" && <RoleSelect onSelectRole={handleRoleSelect} />}

      {screen === "login" && role && (
        <LoginScreen
          role={role}
          onLogin={handleLogin}
          onBack={() => setScreen("roleSelect")}
          loading={loginLoading}
          error={loginError}
        />
      )}

      {screen === "studentDashboard" && studentData && (
        <StudentDashboard
          fullName={studentData.fullName}
          mobile={studentData.mobile}
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onLogout={handleLogout}
        />
      )}

      {screen === "parentDashboard" && studentData && (
        <ParentDashboard
          fullName={studentData.fullName}
          mobile={studentData.mobile}
          studentProgress={progress}
          studentMobile={studentData.mobile}
          onLogout={handleLogout}
        />
      )}

      {(screen === "studentDashboard" || screen === "parentDashboard" || screen === "roleSelect") && (
        <button
          onClick={() => setShowAbout(true)}
          className="fixed bottom-20 left-4 z-30 bg-card border border-border shadow-card rounded-2xl px-3 py-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors touch-btn"
          style={{ bottom: screen === "studentDashboard" ? "80px" : "16px" }}
        >
          ℹ️ About Us
        </button>
      )}

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default Index;
