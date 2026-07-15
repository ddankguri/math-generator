"use client";

import React, { useState, useEffect, useRef } from "react";
import MathText from "./MathText";
import { curriculum } from "@/data/curriculum/elementary5";
import { getExamMetadata, generateProblems, getProblemTypes } from "@/engine/registry";
import { validateFiveChoiceProblems } from "@/engine/validators/problem";
import { exportExamPaperPdf } from "@/pdf/exportExamPaperPdf";
import { difficultyLabels } from "@/types/problem";
import type { GeneratedProblem, ProblemDifficulty, ProblemTypeId } from "@/types/problem";

export default function ExamPaper() {
  const allProblemTypes = getProblemTypes();
  const grades = curriculum.map((item) => item.grade);

  // Problems state
  const [problems, setProblems] = useState<GeneratedProblem[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("초등 5학년");
  const [selectedUnit, setSelectedUnit] = useState<string>("분수");
  const [selectedTopic, setSelectedTopic] = useState<string>("분수의 덧셈");
  const [selectedCount, setSelectedCount] = useState<number>(5); // Default to 5 questions
  const [selectedProblemType, setSelectedProblemType] = useState<ProblemTypeId>("FRA_ADD_001");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty>("normal");
  const selectedCurriculum = curriculum.find((item) => item.grade === selectedGrade) ?? curriculum[0];
  const availableUnits = selectedCurriculum.units;
  const selectedCurriculumUnit = availableUnits.find((unit) => unit.name === selectedUnit) ?? availableUnits[0];
  const availableTopics = selectedCurriculumUnit.concepts;
  const availableProblemTypes = allProblemTypes.filter(
    (type) => type.grade === selectedGrade && type.unit === selectedUnit && type.topic === selectedTopic
  );
  const selectedProblemTypeDefinition = availableProblemTypes.find((type) => type.id === selectedProblemType);
  const availableDifficulties = selectedProblemTypeDefinition?.difficultyLevels ?? ["easy", "normal", "hard"];
  const examMetadata = selectedProblemTypeDefinition
    ? getExamMetadata(selectedProblemType, selectedDifficulty)
    : {
        title: `${selectedGrade} ${selectedTopic}`,
        subtitle: "선택한 개념에 구현된 유형이 없습니다.",
      };

  // Modes: 'practice' (연습 모드) | 'exam' (실전 시험 모드)
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  // Student Info
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  
  // Timer State
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // PDF Exporting State
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Ref to the exam paper sheet itself
  const examPaperRef = useRef<HTMLDivElement>(null);

  // circular number symbols
  const circleNumbers = ["①", "②", "③", "④", "⑤"];

  // Generate a new test from the pool
  const generateNewExam = (
    count: number,
    typeCode = selectedProblemType,
    difficulty = selectedDifficulty
  ) => {
    if (!allProblemTypes.some((type) => type.id === typeCode)) {
      alert("선택한 조건에 생성 가능한 문제 유형이 없습니다.");
      return;
    }

    let generatedProblems = generateProblems({ count, problemTypeId: typeCode, difficulty });

    try {
      validateFiveChoiceProblems(generatedProblems);
    } catch {
      generatedProblems = generateProblems({ count, problemTypeId: typeCode, difficulty });
      validateFiveChoiceProblems(generatedProblems);
    }

    setProblems(generatedProblems);
    setUserAnswers({});
    setIsSubmitted(false);
    setExpandedExplanations({});
    setTimeElapsed(0);
  };

  // Initialize from a validated learning-page link, or fall back to the default type.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const query = new URLSearchParams(window.location.search);
      const requestedType = query.get("type");
      const matchedType = allProblemTypes.find((type) =>
        type.id === requestedType &&
        type.grade === "초등 5학년" &&
        type.unit === "분수" &&
        type.topic === "분수의 덧셈"
      );

      const initialType = matchedType?.id ?? "FRA_ADD_001";
      if (matchedType) {
        setSelectedGrade(matchedType.grade);
        setSelectedUnit(matchedType.unit);
        setSelectedTopic(matchedType.topic);
        setSelectedProblemType(matchedType.id);
      }
      generateNewExam(5, initialType, "normal");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!availableUnits.some((unit) => unit.name === selectedUnit)) {
      setSelectedUnit(availableUnits[0]?.name ?? "");
    }
  }, [availableUnits, selectedUnit]);

  useEffect(() => {
    if (!availableTopics.some((topic) => topic.name === selectedTopic)) {
      setSelectedTopic(availableTopics[0]?.name ?? "");
    }
  }, [availableTopics, selectedTopic]);

  useEffect(() => {
    if (availableProblemTypes.length === 0) return;

    if (!availableProblemTypes.some((type) => type.id === selectedProblemType)) {
      setSelectedProblemType(availableProblemTypes[0].id);
    }
  }, [availableProblemTypes, selectedProblemType]);

  useEffect(() => {
    if (!availableDifficulties.includes(selectedDifficulty)) {
      setSelectedDifficulty(availableDifficulties[0]);
    }
  }, [availableDifficulties, selectedDifficulty]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isSubmitted && mode === "exam") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isSubmitted, mode]);

  // Reset timer when switching modes
  useEffect(() => {
    if (mode === "practice") {
      setTimeElapsed(0);
      setIsTimerRunning(false);
    } else {
      setTimeElapsed(0);
      setIsTimerRunning(true);
    }
  }, [mode]);

  // Calculate score
  const totalProblems = problems.length;
  const correctCount = problems.reduce((count, prob) => {
    return count + (userAnswers[prob.id] === prob.answer ? 1 : 0);
  }, 0);
  const score = totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 0;

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset all states
  const handleReset = () => {
    if (window.confirm("모든 답안을 초기화하고 다시 푸시겠습니까?")) {
      setUserAnswers({});
      setIsSubmitted(false);
      setExpandedExplanations({});
      setTimeElapsed(0);
      setIsTimerRunning(mode === "exam");
    }
  };

  // Option selection handler
  const handleSelectOption = (problemId: string, option: string) => {
    if (isSubmitted && mode === "exam") return; // locked after submission

    setUserAnswers((prev) => ({
      ...prev,
      [problemId]: option,
    }));
  };

  // Submit Exam
  const handleSubmitExam = () => {
    const unanswered = problems.filter((p) => !userAnswers[p.id]);
    if (unanswered.length > 0) {
      if (
        !window.confirm(
          `아직 풀지 않은 문제가 ${unanswered.length}개 있습니다. 정말로 제출하시겠습니까?`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm("시험지를 제출하시겠습니까? 제출 후에는 답안을 수정할 수 없습니다.")) {
        return;
      }
    }

    setIsSubmitted(true);
    setIsTimerRunning(false);
    const allExp: Record<string, boolean> = {};
    problems.forEach((p) => {
      allExp[p.id] = true;
    });
    setExpandedExplanations(allExp);
  };

  // Toggle single explanation
  const toggleExplanation = (problemId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Download PDF using html2canvas and jsPDF (Import dynamically to prevent SSR errors)
  const handleDownloadPdf = async () => {
    if (!examPaperRef.current) {
      alert("PDF export target was not found.");
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await exportExamPaperPdf({
        element: examPaperRef.current,
        studentName,
      });
    } catch (error: unknown) {
      console.error("PDF generation failed with exception:", error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`PDF download failed.\nError: ${message}`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 select-none print:p-0 print:m-0 print:max-w-full">
      
      {/* Upper Navigation/Controls (Hidden during printing) */}
      <div id="generator-controls" className="no-print mb-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Info */}
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            수학 문제 풀이 & 출력 시스템
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Next.js + Tailwind CSS + KaTeX 엔진 기반
          </p>
        </div>

        {/* Right: Controls Panel */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* 1. Problem Count Selector & Generate Button */}
          <div className="flex flex-wrap items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <label htmlFor="grade-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-2">
              학년:
            </label>
            <select
              id="grade-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 text-xs md:text-sm font-bold border-0 focus:ring-0 focus:outline-none cursor-pointer py-1.5 px-1 pr-8"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <label htmlFor="unit-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-2">
              단원:
            </label>
            <select
              id="unit-select"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 text-xs md:text-sm font-bold border-0 focus:ring-0 focus:outline-none cursor-pointer py-1.5 px-1 pr-8"
            >
              {availableUnits.map((unit) => (
                <option key={unit.name} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
            <label htmlFor="topic-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-2">
              개념:
            </label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 text-xs md:text-sm font-bold border-0 focus:ring-0 focus:outline-none cursor-pointer py-1.5 px-1 pr-8"
            >
              {availableTopics.map((topic) => (
                <option key={topic.name} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>
            <label htmlFor="type-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-2">
              유형:
            </label>
            <select
              id="type-select"
              value={selectedProblemTypeDefinition ? selectedProblemType : ""}
              onChange={(e) => setSelectedProblemType(e.target.value as ProblemTypeId)}
              disabled={availableProblemTypes.length === 0}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 text-xs md:text-sm font-bold border-0 focus:ring-0 focus:outline-none cursor-pointer py-1.5 px-1 pr-8 max-w-[240px] disabled:text-zinc-400 disabled:cursor-not-allowed"
            >
              {availableProblemTypes.length === 0 ? (
                <option value="">구현된 유형 없음</option>
              ) : (
                availableProblemTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.id} - {type.typeName}
                  </option>
                ))
              )}
            </select>
            <label htmlFor="difficulty-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-2">
              난이도:
            </label>
            <select
              id="difficulty-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as ProblemDifficulty)}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 text-xs md:text-sm font-bold border-0 focus:ring-0 focus:outline-none cursor-pointer py-1.5 px-1 pr-8"
            >
              {availableDifficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficultyLabels[difficulty]}
                </option>
              ))}
            </select>
            <label htmlFor="count-select" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-2">
              출제:
            </label>
            <select
              id="count-select"
              value={selectedCount}
              onChange={(e) => setSelectedCount(Number(e.target.value))}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 text-xs md:text-sm font-bold border-0 focus:ring-0 focus:outline-none cursor-pointer py-1.5 px-1 pr-8"
            >
              <option value={3}>3문제</option>
              <option value={5}>5문제</option>
              <option value={8}>8문제(전체)</option>
            </select>
            <button
              onClick={() => generateNewExam(selectedCount, selectedProblemType, selectedDifficulty)}
              disabled={!selectedProblemTypeDefinition}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm"
            >
              시험지 생성
            </button>
          </div>

          {/* Mode Selector */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex">
            <button
              onClick={() => {
                if (isSubmitted && !window.confirm("진행 중인 시험 결과를 잃게 됩니다. 모드를 변경하시겠습니까?")) return;
                setMode("practice");
                setIsSubmitted(false);
                setUserAnswers({});
              }}
              className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === "practice"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              연습 모드
            </button>
            <button
              onClick={() => {
                setMode("exam");
                setIsSubmitted(false);
                setUserAnswers({});
              }}
              className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === "exam"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              실전 시험 모드
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors shadow-md"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              인쇄
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors shadow-sm"
              title="초기화"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Exam Paper on left (or full), OMR/Status on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
        
        {/* Left Side: Traditional Math Exam Paper */}
        <div
          ref={examPaperRef}
          data-exam-paper
          style={{
            backgroundColor: "#fcfbf9",
            color: "#18181b",
            borderColor: "#e4e4e7",
          }}
          className="lg:col-span-9 shadow-2xl rounded-3xl border p-8 md:p-12 transition-all relative overflow-hidden exam-page print:shadow-none print:border-none print:p-0 print:bg-white print:text-black"
        >
          
          {/* Subtle Watermark on Exam Paper */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.015] dark:opacity-[0.03] select-none no-print">
            <span className="text-9xl font-black rotate-[-30deg] uppercase tracking-widest text-zinc-900">
              MATH EXAM
            </span>
          </div>

          {/* PDF Download Button (Exam Paper Top Right, Hidden in Print) */}
          <div className="absolute top-4 right-4 no-print">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 bg-white hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-md disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PDF 다운로드 중...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF 다운로드
                </>
              )}
            </button>
          </div>

          {/* Traditional School Exam Header */}
          <div className="border-4 border-double border-zinc-900 dark:border-zinc-400 p-4 md:p-6 mb-8 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-black">
            {/* Title Block */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-serif print:text-2xl">
                {examMetadata.title}
              </h1>
              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1 font-medium font-serif print:text-zinc-600">
                {examMetadata.subtitle}
              </p>
            </div>
            
            {/* Examinee Meta Block */}
            <div className="grid grid-cols-2 md:flex items-center gap-3 text-xs md:text-sm font-serif">
              <div className="flex items-center gap-2 border border-zinc-400 dark:border-zinc-600 p-2 rounded">
                <span className="font-bold text-zinc-500 dark:text-zinc-400 print:text-zinc-700">수험번호:</span>
                <input
                  type="text"
                  placeholder="12345"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-16 md:w-20 bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none text-center font-sans focus:border-indigo-500 text-sm py-0.5 print:border-black print:text-black print:placeholder-transparent"
                />
              </div>
              <div className="flex items-center gap-2 border border-zinc-400 dark:border-zinc-600 p-2 rounded">
                <span className="font-bold text-zinc-500 dark:text-zinc-400 print:text-zinc-700">성명:</span>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-16 md:w-20 bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none text-center font-sans focus:border-indigo-500 text-sm py-0.5 print:border-black print:text-black print:placeholder-transparent"
                />
              </div>
              
              {/* Score indicator (Print only) */}
              <div className="col-span-2 md:flex items-center gap-2 border border-zinc-400 dark:border-zinc-600 p-2 rounded justify-between min-w-[80px] print:flex">
                <span className="font-bold text-zinc-500 dark:text-zinc-400 print:text-zinc-700">점수:</span>
                <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400 min-w-[30px] text-right font-mono print:text-black">
                  {isSubmitted && mode === "exam" ? `${score}점` : "   "}
                </span>
              </div>
            </div>
          </div>

          {/* Practice Mode Intro or Exam Score Summary */}
          {mode === "exam" && isSubmitted && (
            <div className="no-print mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 border-2 border-indigo-200 dark:border-zinc-700 rounded-2xl shadow-inner flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-lg ${
                  score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
                }`}>
                  {score}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">시험 평가 완료</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    맞힌 문제: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{correctCount}</span> / {totalProblems} (소요 시간: {formatTime(timeElapsed)})
                  </p>
                </div>
              </div>
              
              <div className="text-sm italic font-medium text-zinc-600 dark:text-zinc-300">
                {score === 100
                  ? "🎉 완벽합니다! 수학 마스터이시군요!"
                  : score >= 80
                  ? "👍 훌륭한 성적입니다. 실수한 부분만 점검해보세요!"
                  : score >= 60
                  ? "💪 조금만 더 복습하면 완벽하게 이해할 수 있어요!"
                  : "📚 개념 학습부터 오답 풀이까지 차근차근 다시 공부해보아요."}
              </div>
            </div>
          )}

          {mode === "practice" && (
            <div className="no-print mb-8 px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <strong>연습 모드 활성화됨:</strong> 문제를 풀면 정답 여부와 해설이 즉시 표시됩니다. (다양하게 선택하고 복습할 수 있습니다)
            </div>
          )}

          {/* Exam Paper Grid Layout (2-column on large screens, vertical divider) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 print-grid relative">
            {/* Center Dashed Divider Line (Desktop and Print only) */}
            {totalProblems > 1 && (
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 border-l border-dashed border-zinc-300 dark:border-zinc-800 print-divider -translate-x-1/2"></div>
            )}
            
            {problems.map((problem) => {
              if (problem.choices.length !== 5) {
                throw new Error(`Problem ${problem.id} must render exactly 5 choices.`);
              }

              const selectedAnswer = userAnswers[problem.id];
              const isCorrect = selectedAnswer === problem.answer;
              const hasAnswered = !!selectedAnswer;
              
              // Determine border coloring based on correctness and mode
              let cardStyle = "relative pb-6 border-b border-dashed border-zinc-200 dark:border-zinc-800 last:border-0";
              let labelStyle = "text-base font-bold font-serif mb-2 flex items-start gap-1.5";
              
              if (mode === "practice" && hasAnswered) {
                cardStyle += isCorrect 
                  ? " bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl p-3 -m-3 transition-colors duration-300"
                  : " bg-rose-50/30 dark:bg-rose-950/10 rounded-xl p-3 -m-3 transition-colors duration-300";
              } else if (mode === "exam" && isSubmitted) {
                cardStyle += isCorrect 
                  ? " bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl p-3 -m-3 transition-colors duration-300"
                  : " bg-rose-50/30 dark:bg-rose-950/10 rounded-xl p-3 -m-3 transition-colors duration-300";
              }

              return (
                <div key={problem.id} className={cardStyle}>
                  
                  {/* Problem Question Header */}
                  <div className={labelStyle}>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono print:text-black">
                      {problem.id.toString().padStart(2, "0")}.
                    </span>
                    <div className="flex-1">
                      <MathText text={problem.question} />
                    </div>

                    {/* Practice mode instant indicator */}
                    {mode === "practice" && hasAnswered && (
                      <span className="ml-2 flex-shrink-0 no-print">
                        {isCorrect ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-sm bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            ✓ 정답
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 text-sm bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                            ✗ 오답
                          </span>
                        )}
                      </span>
                    )}

                    {/* Exam mode submission indicator */}
                    {mode === "exam" && isSubmitted && (
                      <span className="ml-2 flex-shrink-0 no-print">
                        {isCorrect ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-sm bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            ✓ 맞힘
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 text-sm bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                            ✗ 틀림
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="mt-4 space-y-2 pl-6">
                    {problem.choices.map((option, optIdx) => {
                      const isOptionSelected = selectedAnswer === option;
                      const isOptionCorrect = option === problem.answer;
                      
                      // Highlight styles
                      let optionButtonClass = "w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none ";
                      
                      if (mode === "practice") {
                        if (isOptionSelected) {
                          optionButtonClass += isCorrect
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-500 font-medium"
                            : "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-2 border-rose-500 font-medium";
                        } else if (hasAnswered && isOptionCorrect) {
                          optionButtonClass += "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-dashed border-emerald-400";
                        } else {
                          optionButtonClass += "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-transparent";
                        }
                      } else if (mode === "exam") {
                        if (isSubmitted) {
                          if (isOptionSelected) {
                            optionButtonClass += isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-500 font-medium"
                              : "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-2 border-rose-500 font-medium";
                          } else if (isOptionCorrect) {
                            optionButtonClass += "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-dashed border-emerald-400";
                          } else {
                            optionButtonClass += "text-zinc-400 dark:text-zinc-600 border border-transparent cursor-not-allowed";
                          }
                        } else {
                          optionButtonClass += isOptionSelected
                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-500 font-semibold shadow-sm"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(problem.id, option)}
                          disabled={mode === "exam" && isSubmitted}
                          className={optionButtonClass}
                        >
                          {/* Circular Marker (①, ②, ③, ④) */}
                          <span className={`text-base font-medium flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border transition-all ${
                            isOptionSelected 
                              ? (mode === "practice" ? (isCorrect ? "border-emerald-600 bg-emerald-600 text-white" : "border-rose-600 bg-rose-600 text-white") : "border-indigo-600 bg-indigo-600 text-white")
                              : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                          } print:border-black print:text-black print:bg-transparent`}>
                            {circleNumbers[optIdx]}
                          </span>
                          
                          <span className="flex-1 font-serif">
                            <MathText text={option} />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Printable scratch space (Visible in Print Mode, Hidden in screen) */}
                  <div className="hidden print:block mt-6 mb-2 border border-dashed border-zinc-300 p-6 rounded-lg text-center">
                    <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-sans">
                      풀이 과정 및 연습 공간 (Scratch Space)
                    </span>
                  </div>

                  {/* Practice mode / Exam results: Toggleable Explanation Box */}
                  {((mode === "practice" && hasAnswered) || (mode === "exam" && isSubmitted)) && (
                    <div className="mt-4 pl-6 no-print">
                      <button
                        onClick={() => toggleExplanation(problem.id)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        <span>{expandedExplanations[problem.id] ? "▼ 해설 숨기기" : "▶ 해설 보기"}</span>
                      </button>

                      {expandedExplanations[problem.id] && (
                        <div className="mt-3 p-4 bg-amber-50/50 dark:bg-zinc-900/50 border border-amber-200/50 dark:border-zinc-800 rounded-xl text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 shadow-inner">
                          <div className="font-bold text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            풀이 및 해설:
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-white">정답: </span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {circleNumbers[problem.answerChoiceIndex]}{" "}
                            </span>
                            <MathText text={problem.answer} />
                          </div>
                          <ol className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-400 font-serif list-decimal list-inside">
                            {problem.solutionSteps.map((step, stepIdx) => (
                              <li key={`${problem.id}-step-${stepIdx}`}>
                                <MathText text={step} />
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden print-only mt-12 pt-8 border-t border-zinc-900 font-serif">
            <h2 className="text-lg font-extrabold mb-4">정답 및 풀이</h2>
            <div className="space-y-4">
              {problems.map((problem) => (
                <div key={`answer-${problem.id}`} className="text-sm leading-relaxed break-inside-avoid">
                  <div className="font-extrabold mb-1">
                    문제 {problem.id}
                  </div>
                  <div>
                    <span className="font-bold">정답: </span>
                    {circleNumbers[problem.answerChoiceIndex]}
                  </div>
                  <div className="font-bold mt-1">풀이:</div>
                  <ol className="space-y-1">
                    {problem.solutionSteps.map((step, stepIdx) => (
                      <li key={`print-${problem.id}-step-${stepIdx}`}>
                        {stepIdx + 1}) <MathText text={step} />
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* End of Exam Paper signature block (traditional look) */}
          <div className="mt-12 pt-8 border-t border-zinc-900 dark:border-zinc-600 text-center font-serif">
            <p className="text-sm tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              - 수고하셨습니다 -
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-mono print:text-zinc-600">
              Generated by Google Antigravity. Licensed under open source standards.
            </p>
          </div>
        </div>

        {/* Right Side: Status/OMR Panel (Hidden in print) */}
        <div className="no-print lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-6">
          
          {/* Status & Timer Card */}
          {mode === "exam" && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  실시간 타이머
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold uppercase animate-pulse">
                  시험 중
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono tracking-wider text-zinc-900 dark:text-white">
                  {formatTime(timeElapsed)}
                </span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  disabled={isSubmitted}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    isTimerRunning
                      ? "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      : "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  } disabled:opacity-50`}
                >
                  {isTimerRunning ? "일시정지" : "계속하기"}
                </button>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalProblems > 0 ? (Object.keys(userAnswers).length / totalProblems) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="text-right text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                진행 상황: {Object.keys(userAnswers).length} / {totalProblems} 문제 풀이 완료
              </span>
            </div>
          )}

          {/* OMR Card (Traditional Style Card) */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
            
            {/* OMR Card Header */}
            <div className="bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-800 px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 tracking-wider">
                  OMR 답안지
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300">
                FORM NO. {totalProblems.toString().padStart(2, "0")}
              </span>
            </div>

            {/* OMR Card Body */}
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-6 gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <div className="text-left pl-1">NO.</div>
                <div>①</div>
                <div>②</div>
                <div>③</div>
                <div>④</div>
                <div>⑤</div>
              </div>

              {totalProblems === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  선택된 문제가 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {problems.map((prob) => {
                    const selectedAnswer = userAnswers[prob.id];
                    const isCorrect = selectedAnswer === prob.answer;

                    return (
                      <div key={prob.id} className="grid grid-cols-6 gap-2 items-center text-center">
                        
                        {/* OMR Item Number */}
                        <div className="text-left pl-1 text-xs font-bold font-mono text-zinc-500">
                          {prob.id.toString().padStart(2, "0")}
                        </div>
                        
                        {/* OMR Choice Bubbles */}
                        {prob.choices.map((opt, optIdx) => {
                          const isOptionSelected = selectedAnswer === opt;
                          const isOptionCorrect = opt === prob.answer;
                          
                          let bubbleClass = "w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border transition-all ";
                          
                          if (isOptionSelected) {
                            if (mode === "exam" && isSubmitted) {
                              bubbleClass += isCorrect
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                : "bg-rose-600 border-rose-600 text-white shadow-sm";
                            } else if (mode === "practice") {
                              bubbleClass += isCorrect
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                : "bg-rose-600 border-rose-600 text-white shadow-sm";
                            } else {
                              bubbleClass += "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-950 font-extrabold ring-2 ring-zinc-500/20";
                            }
                          } else {
                            if ((mode === "exam" && isSubmitted || mode === "practice" && selectedAnswer) && isOptionCorrect) {
                              bubbleClass += "bg-emerald-50 dark:bg-emerald-950/20 border-dashed border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold";
                            } else {
                              bubbleClass += "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(prob.id, opt)}
                              disabled={mode === "exam" && isSubmitted}
                              className={bubbleClass}
                            >
                              {optIdx + 1}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit Buttons / Score Panel */}
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                {mode === "exam" ? (
                  !isSubmitted ? (
                    <button
                      onClick={handleSubmitExam}
                      disabled={totalProblems === 0}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all duration-200 shadow-md text-sm tracking-widest flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      시험지 제출하기
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 text-center rounded-xl font-bold text-sm text-zinc-700 dark:text-zinc-300">
                        최종 점수: {score}점 / 100점
                      </div>
                      <button
                        onClick={() => {
                          setUserAnswers({});
                          setIsSubmitted(false);
                          setExpandedExplanations({});
                          setTimeElapsed(0);
                          setIsTimerRunning(true);
                        }}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-sm text-sm"
                      >
                        시험 다시 보기
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => setUserAnswers({})}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="w-full py-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-1.5"
                  >
                    연습 답안 지우기
                  </button>
                )}
              </div>

            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
