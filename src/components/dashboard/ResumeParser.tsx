"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Loader2, Scan } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface ResumeParserProps {
  onParse: (data: { skills: string[]; bio: string }) => void;
}

// Common skills keywords to extract
const SKILL_KEYWORDS = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
  "React", "Vue", "Angular", "Node.js", "Express", "Django", "Flask",
  "Machine Learning", "Deep Learning", "AI", "Artificial Intelligence",
  "Data Science", "Data Analysis", "Statistics", "Research",
  "SQL", "MongoDB", "PostgreSQL", "Redis",
  "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
  "Computer Vision", "NLP", "Natural Language Processing",
  "MATLAB", "R", "SPSS", "Tableau", "Power BI"
];

export default function ResumeParser({ onParse }: ResumeParserProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

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
      
      // Small delay for visual effect
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return fullText;
  };

  const extractSkills = (text: string): string[] => {
    const foundSkills: string[] = [];

    SKILL_KEYWORDS.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    });

    // Remove duplicates and return
    return Array.from(new Set(foundSkills));
  };

  const extractBio = (text: string): string => {
    // Extract first 200 characters as summary
    const cleaned = text.replace(/\s+/g, " ").trim();
    return cleaned.substring(0, 200);
  };

  const processFile = async (file: File) => {
    setIsScanning(true);
    setProgress(0);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);

      // Extract information
      const skills = extractSkills(text);
      const bio = extractBio(text);

      // Call the callback with extracted data
      onParse({
        skills,
        bio,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Failed to process PDF. Please try again.");
    } finally {
      setIsScanning(false);
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
    [onParse]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isScanning,
  });

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-300 overflow-hidden
          ${
            isDragActive
              ? "border-teal-400 bg-teal-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              : "border-teal-500/30 bg-black/40 hover:border-teal-400 hover:bg-teal-500/5 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          }
          ${isScanning ? "cursor-not-allowed border-teal-400" : ""}
        `}
      >
        {/* Cyberpunk grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Scanning animation overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-teal-500/5 animate-pulse"></div>
        )}

        <input {...getInputProps()} />
        
        <div className="relative z-10">
          {isScanning ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
                <Scan className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-mono text-teal-400 mb-3 tracking-wider">
                  SCANNING...
                </p>
                <div className="w-full bg-black/60 border border-teal-500/30 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400 h-full transition-all duration-300 relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-teal-400/50 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs font-mono text-teal-400/70 mt-2">
                  {Math.round(progress)}% COMPLETE
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="relative">
                  <FileText className="w-10 h-10 text-teal-400" />
                  {isDragActive && (
                    <div className="absolute -inset-2 border-2 border-teal-400 rounded-lg animate-pulse"></div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-mono text-teal-400 tracking-wider mb-1">
                  {isDragActive ? ">>> DROP RESUME <<<" : "DROP RESUME (PDF) TO AUTO-FILL"}
                </p>
                <p className="text-xs font-mono text-teal-400/50">
                  PDF FILES ONLY
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Terminal-style corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-400/50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-400/50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-400/50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-400/50"></div>
      </div>
    </div>
  );
}

