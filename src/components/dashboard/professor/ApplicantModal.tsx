"use client";

import React from "react";
import { X, User, FileText, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import type { Application, Profile } from "@/lib/supabase/types";

interface ApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onAccept: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

export default function ApplicantModal({
  isOpen,
  onClose,
  application,
  onAccept,
  onReject,
}: ApplicantModalProps) {
  if (!isOpen || !application) return null;

  const studentProfile = application.student_profile as Profile | undefined;
  const job = application.job;

  const handleAccept = () => {
    if (application.id) {
      onAccept(application.id);
    }
  };

  const handleReject = () => {
    if (application.id) {
      onReject(application.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Review Applicant</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Student Information */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <User className="w-8 h-8 text-teal-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-1">
                  {studentProfile?.full_name || "Anonymous Student"}
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  {studentProfile?.university || "University not specified"}
                </p>
                {studentProfile?.r_score !== null && studentProfile?.r_score !== undefined && (
                  <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 text-teal-400 px-3 py-1 rounded-lg text-sm font-medium">
                    R-Score: {studentProfile.r_score}/100
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Information */}
          {job && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-400 mb-2">Applied For</h5>
              <p className="text-white font-medium">{job.title}</p>
              <p className="text-sm text-gray-400 mt-1">{job.university}</p>
            </div>
          )}

          {/* Cover Letter / Elevator Pitch */}
          {application.elevator_pitch && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Cover Letter / Elevator Pitch
              </h5>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {application.elevator_pitch}
              </p>
            </div>
          )}

          {/* Resume / Portfolio Links */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
            <h5 className="text-sm font-medium text-gray-400 mb-3">Documents & Links</h5>
            
            {application.resume_filename && (
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-400" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Resume</p>
                  <p className="text-gray-400 text-xs">{application.resume_filename}</p>
                </div>
                {studentProfile?.resume_link && (
                  <a
                    href={studentProfile.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-sm"
                  >
                    View <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {application.portfolio_link && (
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-teal-400" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Portfolio</p>
                  <p className="text-gray-400 text-xs truncate">{application.portfolio_link}</p>
                </div>
                <a
                  href={application.portfolio_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-sm"
                >
                  Open <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {!application.resume_filename && !application.portfolio_link && (
              <p className="text-gray-400 text-sm">No documents or links provided</p>
            )}
          </div>

          {/* Skills */}
          {studentProfile?.skills && studentProfile.skills.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-400 mb-3">Skills</h5>
              <div className="flex flex-wrap gap-2">
                {studentProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded border border-white/5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Application Date */}
          {application.created_at && (
            <div className="text-xs text-gray-500">
              Applied on {new Date(application.created_at).toLocaleDateString()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleReject}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-medium py-3 rounded-lg transition-all"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-medium py-3 rounded-lg transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              Accept for Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

