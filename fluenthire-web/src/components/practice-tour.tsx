"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { CallBackProps, Step, TooltipRenderProps } from "react-joyride";
import { useTheme } from "next-themes";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

const QA_STORAGE_KEY = "fluenthire_qa_tour_completed";
const TOL_STORAGE_KEY = "fluenthire_tol_tour_completed";

const QA_STEPS: Step[] = [
  {
    target: '[data-tour="qa-question"]',
    content:
      "Read the question carefully. Answer it as if you were in a real interview — be specific, structured, and use technical terms.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="qa-coaching-tip"]',
    content:
      "Each category has a coaching tip with advice on how to structure your answer for the best results.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="qa-textarea"]',
    content:
      "Type your answer here, or use the microphone to speak it. You can always edit the text after recording.",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: '[data-tour="qa-mic"]',
    content:
      "Click to record your answer. Speak naturally — you have up to 3 minutes. The recording will be transcribed automatically.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: '[data-tour="qa-word-count"]',
    content:
      "Aim for 100–300 words. You need at least 20 words to submit. The counter helps you gauge your response length.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="qa-submit"]',
    content:
      "When you're ready, submit your answer. Our AI will evaluate your communication clarity, technical depth, and give you actionable feedback.",
    disableBeacon: true,
    placement: "top",
  },
];

function TourTooltip({
  index,
  step,
  size,
  isLastStep,
  backProps,
  primaryProps,
  tooltipProps,
  isDark,
}: TooltipRenderProps & { isDark: boolean }) {
  return (
    <div
      {...tooltipProps}
      style={{
        backgroundColor: isDark ? "#1e1e2e" : "#ffffff",
        borderRadius: 12,
        padding: "16px 20px",
        maxWidth: 340,
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        style={{
          color: isDark ? "#e2e8f0" : "#1e293b",
          fontSize: 14,
          lineHeight: 1.6,
          textAlign: "left",
          padding: "4px 0 16px",
        }}
      >
        {step.content}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: isDark ? "#64748b" : "#94a3b8",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {index + 1} of {size}
        </span>

        <div style={{ display: "flex", gap: 8 }}>
          {index > 0 && (
            <button
              {...backProps}
              style={{
                background: "none",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: 8,
                color: isDark ? "#94a3b8" : "#64748b",
                cursor: "pointer",
                fontSize: 13,
                padding: "8px 16px",
              }}
            >
              Back
            </button>
          )}
          <button
            {...primaryProps}
            style={{
              background: isDark ? "#818cf8" : "#6366f1",
              border: "none",
              borderRadius: 8,
              color: "#ffffff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 16px",
            }}
          >
            {isLastStep ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function useTour(storageKey: string) {
  const [run, setRun] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      const timer = setTimeout(() => setRun(true), 800);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      const { status } = data;
      if (status === "finished" || status === "skipped") {
        localStorage.setItem(storageKey, "true");
        setRun(false);
      }
    },
    [storageKey]
  );

  return { run, handleCallback, isDark: resolvedTheme === "dark" };
}

const TOUR_STYLES = {
  options: {
    zIndex: 10000,
    overlayColor: "rgba(0, 0, 0, 0.5)",
  },
  spotlight: {
    borderRadius: 12,
    border: "2px solid #93a3f8",
  },
};

export function QATour() {
  const { run, handleCallback, isDark } = useTour(QA_STORAGE_KEY);

  return (
    <Joyride
      steps={QA_STEPS}
      run={run}
      continuous
      callback={handleCallback}
      tooltipComponent={(props) => <TourTooltip {...props} isDark={isDark} />}
      floaterProps={{ hideArrow: true }}
      styles={TOUR_STYLES}
    />
  );
}

const INTERVIEW_STORAGE_KEY = "fluenthire_interview_tour_completed";
const BEHAVIORAL_STORAGE_KEY = "fluenthire_behavioral_tour_completed";

const INTERVIEW_STEPS: Step[] = [
  {
    target: '[data-tour="interview-timer"]',
    content:
      "Keep an eye on the countdown. The interview ends automatically when time runs out. It turns amber at 5 minutes and red at 1 minute — pace yourself.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="interview-problem"]',
    content:
      "The problem statement lives here. Read it carefully before coding. You can collapse this panel to get more editor space.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="interview-editor"]',
    content:
      "Write your solution here. The AI interviewer can see your code and will ask about your approach, suggest improvements, and discuss tradeoffs — just like a real interview.",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: '[data-tour="interview-conversation"]',
    content:
      "This is your AI interviewer. It will ask follow-up questions, challenge your assumptions, and probe your understanding. Speak naturally using your microphone — it's a real conversation.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: '[data-tour="interview-mute"]',
    content:
      "Your microphone is on by default. Use this to mute/unmute. The AI interviewer listens and responds in real time.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="interview-end"]',
    content:
      "Click here when you're done, or let the timer run out. Your session will be scored on communication clarity, technical depth, and problem-solving approach.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="interview-start"]',
    content:
      "When you're ready, click here to start. This will connect you to the AI interviewer, start the timer, and use 1 credit. Good luck!",
    disableBeacon: true,
    placement: "bottom",
  },
];

const BEHAVIORAL_STEPS: Step[] = [
  {
    target: '[data-tour="behavioral-timer"]',
    content:
      "Keep an eye on the countdown. The interview ends automatically when time runs out. Pace your answers — leave time for follow-up questions.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="behavioral-topic"]',
    content:
      "Review the behavioral topic here. The AI will probe your experience using the STAR method — Situation, Task, Action, Result. Think of a specific example before you start.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="behavioral-conversation"]',
    content:
      "This is your AI interviewer. It will dig deeper into your experiences with follow-up questions. Answer naturally, provide specific examples, and explain what you learned.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="interview-mute"]',
    content:
      "Your microphone is on by default. Use this to mute/unmute. Speak naturally — the AI listens and responds in real time.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="behavioral-end"]',
    content:
      "Click here when you're done. Your session will be scored on communication clarity, STAR structure, and self-awareness.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="behavioral-start"]',
    content:
      "When you're ready, click here to start. This will connect you to the AI interviewer, start the timer, and use 1 credit. Good luck!",
    disableBeacon: true,
    placement: "bottom",
  },
];

const TOL_STEPS: Step[] = [
  {
    target: '[data-tour="tol-question"]',
    content:
      "Read the coding problem carefully. Understand the inputs, expected outputs, and constraints before you start coding.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="tol-coaching-tip"]',
    content:
      "Follow this advice: clarify the problem first, then walk through your approach before writing code.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="tol-editor"]',
    content:
      "Write your solution here. Your code won't be executed — our AI reads it to evaluate your logic and problem-solving approach. Pseudocode is perfectly fine.",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: '[data-tour="tol-explanation"]',
    content:
      "Explain your reasoning: why you chose this approach, time/space complexity, tradeoffs, and edge cases. You can type or use the microphone.",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: '[data-tour="tol-word-count"]',
    content:
      "You need at least 15 words in your explanation. The counter helps you track your progress.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="tol-submit"]',
    content:
      "Submit your code and explanation together. Our AI will evaluate your solution, problem-solving process, and communication clarity.",
    disableBeacon: true,
    placement: "top",
  },
];

export function TOLTour() {
  const { run, handleCallback, isDark } = useTour(TOL_STORAGE_KEY);

  return (
    <Joyride
      steps={TOL_STEPS}
      run={run}
      continuous
      callback={handleCallback}
      tooltipComponent={(props) => <TourTooltip {...props} isDark={isDark} />}
      floaterProps={{ hideArrow: true }}
      styles={TOUR_STYLES}
    />
  );
}

export function InterviewTour() {
  const { run, handleCallback, isDark } = useTour(INTERVIEW_STORAGE_KEY);

  return (
    <Joyride
      steps={INTERVIEW_STEPS}
      run={run}
      continuous
      callback={handleCallback}
      tooltipComponent={(props) => <TourTooltip {...props} isDark={isDark} />}
      floaterProps={{ hideArrow: true }}
      styles={TOUR_STYLES}
    />
  );
}

export function BehavioralInterviewTour() {
  const { run, handleCallback, isDark } = useTour(BEHAVIORAL_STORAGE_KEY);

  return (
    <Joyride
      steps={BEHAVIORAL_STEPS}
      run={run}
      continuous
      callback={handleCallback}
      tooltipComponent={(props) => <TourTooltip {...props} isDark={isDark} />}
      floaterProps={{ hideArrow: true }}
      styles={TOUR_STYLES}
    />
  );
}

// ─── Dashboard JD Tour ──────────────────────────────────────────────────────

const JD_TOUR_STORAGE_KEY = "fluenthire_jd_tour_completed";

const JD_TOUR_STEPS: Step[] = [
  {
    target: '[data-tour="jd-card"]',
    content:
      "Here's your job description analysis. We extracted the role, seniority level, and technologies from your posting.",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: '[data-tour="jd-tailored-tab"]',
    content:
      "We've created a personalized set of questions based on your job description. Switch to this tab to practice questions tailored to your target role.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: '[data-tour="jd-edit"]',
    content:
      "Applying to a different role? Click here anytime to paste a new job description and refresh your recommendations.",
    disableBeacon: true,
    placement: "bottom",
  },
];

export function DashboardJDTour() {
  const { run, handleCallback, isDark } = useTour(JD_TOUR_STORAGE_KEY);

  return (
    <Joyride
      steps={JD_TOUR_STEPS}
      run={run}
      continuous
      callback={handleCallback}
      tooltipComponent={(props) => <TourTooltip {...props} isDark={isDark} />}
      floaterProps={{ hideArrow: true }}
      styles={TOUR_STYLES}
    />
  );
}

// ─── Dashboard Improvement Tour ─────────────────────────────────────────────

const IMPROVE_TOUR_STORAGE_KEY = "fluenthire_improve_tour_completed";

const IMPROVE_TOUR_STEPS: Step[] = [
  {
    target: '[data-tour="improve-tab"]',
    content:
      "You have questions scoring below 60. Check this tab to see your weakest areas and retry them.",
    disableBeacon: true,
    placement: "bottom",
  },
];

export function DashboardImproveTour() {
  const { run, handleCallback, isDark } = useTour(IMPROVE_TOUR_STORAGE_KEY);

  return (
    <Joyride
      steps={IMPROVE_TOUR_STEPS}
      run={run}
      continuous
      callback={handleCallback}
      tooltipComponent={(props) => <TourTooltip {...props} isDark={isDark} />}
      floaterProps={{ hideArrow: true }}
      styles={TOUR_STYLES}
    />
  );
}

// ─── Dashboard Welcome Tour ─────────────────────────────────────────────────

const DASHBOARD_TOUR_STORAGE_KEY = "fluenthire_dashboard_tour_completed";

const DASHBOARD_TOUR_STEPS: Step[] = [
  {
    target: '[data-tour="dashboard-start"]',
    content:
      "Welcome to FluentHire! This is your dashboard — here you'll track your progress, find recommended questions, and launch practice sessions.",
    disableBeacon: true,
    placement: "right",
  },
  {
    target: '[data-tour="dashboard-practice-modes"]',
    content:
      "Choose how you want to practice: Q&A for text-based answers, Think Out Loud for coding with narration, or a Live AI Interview with real-time conversation.",
    placement: "top",
  },
  {
    target: '[data-tour="dashboard-recommended"]',
    content:
      "We pick questions based on your profile and skill level. As you practice more, these recommendations get smarter.",
    placement: "top",
  },
  {
    target: '[data-tour="dashboard-credits"]',
    content:
      "Q&A and Think Out Loud are always free. Live AI Interviews cost 1 credit each — check your balance here.",
    placement: "bottom",
  },
  {
    target: '[data-tour="jd-card"]',
    content:
      "Paste a job description here and we'll generate tailored questions and feedback matched to that specific role.",
    placement: "left",
  },
];

export function DashboardWelcomeTour() {
  const { run, handleCallback, isDark } = useTour(DASHBOARD_TOUR_STORAGE_KEY);

  return (
    <Joyride
      steps={DASHBOARD_TOUR_STEPS}
      run={run}
      continuous
      scrollToFirstStep
      scrollOffset={100}
      callback={handleCallback}
      tooltipComponent={(props) => <TourTooltip {...props} isDark={isDark} />}
      floaterProps={{ hideArrow: true }}
      styles={TOUR_STYLES}
    />
  );
}
