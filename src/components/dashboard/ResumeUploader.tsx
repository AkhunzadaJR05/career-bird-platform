"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface ResumeUploaderProps {
  onExtract: (data: { skills: string[]; bio: string; gpa?: string; fullName?: string; university?: string }) => void;
}

// Common skills keywords to extract
const SKILL_KEYWORDS = [
  "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
  "React", "Vue", "Angular", "Node.js", "Express", "Django", "Flask",
  "Machine Learning", "Deep Learning", "AI", "Artificial Intelligence",
  "Data Science", "Data Analysis", "Statistics", "Research",
  "SQL", "MongoDB", "PostgreSQL", "Redis",
  "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
  "Computer Vision", "NLP", "Natural Language Processing",
  "MATLAB", "R", "SPSS", "Tableau", "Power BI"
];

// GPA patterns
const GPA_PATTERNS = [
  /GPA[:\s]*([0-9]\.[0-9]{1,2})/i,
  /Grade Point Average[:\s]*([0-9]\.[0-9]{1,2})/i,
  /([0-9]\.[0-9]{1,2})\s*\/\s*4\.0/i,
  /([0-9]\.[0-9]{1,2})\s*GPA/i,
];

export default function ResumeUploader({ onExtract }: ResumeUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress((i / pdf.numPages) * 100);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + " ";
    }

    return fullText;
  };

  const extractSkills = (text: string): string[] => {
    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    SKILL_KEYWORDS.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    });

    // Remove duplicates and return
    return Array.from(new Set(foundSkills));
  };

  const extractGPA = (text: string): string | undefined => {
    for (const pattern of GPA_PATTERNS) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const gpa = parseFloat(match[1]);
        if (gpa >= 0 && gpa <= 4.0) {
          return gpa.toFixed(2);
        }
      }
    }
    return undefined;
  };

  const extractName = (text: string): string | undefined => {
    // Look for common name patterns at the beginning of the document
    const lines = text.split("\n").slice(0, 5);
    for (const line of lines) {
      const trimmed = line.trim();
      // Simple heuristic: lines with 2-4 words, capitalized
      if (trimmed.length > 5 && trimmed.length < 50) {
        const words = trimmed.split(/\s+/);
        if (words.length >= 2 && words.length <= 4) {
          const allCapitalized = words.every(
            (word) => word[0] === word[0].toUpperCase() && /^[A-Za-z]+$/.test(word)
          );
          if (allCapitalized) {
            return trimmed;
          }
        }
      }
    }
    return undefined;
  };

  const extractUniversity = (text: string): string | undefined => {
    // Look for common university keywords
    const universityKeywords = [
      "University", "College", "Institute", "School", "Academy",
      "MIT", "Stanford", "Harvard", "Oxford", "Cambridge"
    ];

    const lines = text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      for (const keyword of universityKeywords) {
        if (trimmed.includes(keyword) && trimmed.length < 100) {
          return trimmed;
        }
      }
    }
    return undefined;
  };

  const extractBio = (text: string): string => {
    // Extract a bio from sections like "Summary", "About", "Objective", "Profile"
    const bioSections = [
      /(?:Summary|About|Objective|Profile|Introduction)[:\s]*([^\n]{50,500})/i,
      /(?:I am|I'm|My name is)[^\n]{30,300}/i,
    ];

    for (const pattern of bioSections) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().substring(0, 500);
      }
    }

    // Fallback: use first 200 characters of the document
    return text.substring(0, 200).trim();
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setIsComplete(false);
    setFileName(file.name);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);

      // Extract information
      const skills = extractSkills(text);
      const bio = extractBio(text);
      const gpa = extractGPA(text);
      const fullName = extractName(text);
      const university = extractUniversity(text);

      // Simulate processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Call the callback with extracted data
      onExtract({
        skills,
        bio,
        gpa,
        fullName,
        university,
      });

      setIsComplete(true);
      setTimeout(() => {
        setIsComplete(false);
        setFileName(null);
      }, 2000);
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Failed to process PDF. Please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "application/pdf") {
        processFile(file);
      } else {
        alert("Please upload a PDF file.");
      }
    },
    [onExtract]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? "border-teal-500 bg-teal-500/10"
              : "border-white/20 bg-white/5 hover:border-teal-500/50 hover:bg-white/10"
          }
          ${isProcessing ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
            <div>
              <p className="text-sm font-medium text-white mb-2">Parsing Resume...</p>
              <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-teal-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}%</p>
            </div>
            {fileName && (
              <p className="text-xs text-gray-400">{fileName}</p>
            )}
          </div>
        ) : isComplete ? (
          <div className="space-y-2">
            <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
            <p className="text-sm font-medium text-teal-400">Profile Auto-Filled!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              {isDragActive ? (
                <FileText className="w-10 h-10 text-teal-400" />
              ) : (
                <Upload className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {isDragActive ? "Drop your CV here" : "Drop your CV to Auto-Fill Profile"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF files only • Drag and drop or click to browse
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

