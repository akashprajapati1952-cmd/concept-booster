import React, { useState, useRef } from "react";
import { ArrowLeft, Phone, Shield, RefreshCw } from "lucide-react";

interface LoginScreenProps {
  role: "student" | "parent";
  onLogin: (mobile: string) => void;
  onBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ role, onLogin, onBack }) => {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isStudent = role === "student";
  const gradientStyle = isStudent ? "var(--gradient-hero)" : "var(--gradient-teal)";
  const emoji = isStudent ? "🎒" : "👨‍👩‍👧";

  const handleSendOtp = () => {
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate OTP send - in production, use Cloud backend
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(generatedOtp);
    console.log(`Demo OTP for ${mobile}: ${generatedOtp}`); // For demo purposes
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      alert(`📱 Demo OTP: ${generatedOtp}\n(In production, this will be sent via SMS)`);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }
    if (enteredOtp !== sentOtp) {
      setError("Incorrect OTP. Please try again.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(mobile);
    }, 1000);
  };

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
        {step === "mobile" ? (
          <div className="card-fun space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-primary" />
              <p className="font-bold text-foreground">Enter Mobile Number</p>
            </div>

            <div className="flex gap-2">
              <div className="input-fun w-14 text-center font-bold text-muted-foreground flex-shrink-0">
                +91
              </div>
              <input
                type="tel"
                inputMode="numeric"
                className="input-fun flex-1"
                placeholder="10 digit number"
                value={mobile}
                maxLength={10}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
              />
            </div>

            {error && (
              <p className="text-destructive text-sm font-semibold flex items-center gap-1">
                ⚠️ {error}
              </p>
            )}

            <button
              onClick={handleSendOtp}
              disabled={loading || mobile.length !== 10}
              className="btn-hero w-full py-3.5 text-base font-bold touch-btn disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? undefined : gradientStyle }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={18} className="animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP 📱"
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground font-medium">
              OTP आपके mobile पर भेजा जाएगा
            </p>
          </div>
        ) : (
          <div className="card-fun space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-secondary" />
              <p className="font-bold text-foreground">Enter OTP</p>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              OTP sent to +91 {mobile}
            </p>

            <div className="flex gap-3 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            {error && (
              <p className="text-destructive text-sm font-semibold flex items-center gap-1">
                ⚠️ {error}
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join("").length !== 4}
              className="btn-hero w-full py-3.5 text-base font-bold touch-btn disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? undefined : gradientStyle }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={18} className="animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify & Login ✅"
              )}
            </button>

            <button
              onClick={() => {
                setStep("mobile");
                setOtp(["", "", "", ""]);
                setError("");
              }}
              className="w-full text-center text-sm text-primary font-semibold"
            >
              Change Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
