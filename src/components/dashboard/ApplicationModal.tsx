"use client";

import React, { useState } from "react";
import { X, ArrowRight, Upload, CheckCircle2 } from "lucide-react";
import type { Grant } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

interface ApplicationModalProps {
  grant: Grant | null;
  isOpen: boolean;
  onClose: () => void;
  onContinueApplication?: () => void;
}

export default function ApplicationModal({
  grant,
  isOpen,
  onClose,
  onContinueApplication,
}: ApplicationModalProps) {
  const [elevatorPitch, setElevatorPitch] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !grant) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated. Please sign in.");
        setLoading(false);
        return;
      }

      // Get student profile to get student_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile) {
        setError("Profile not found. Please complete your profile first.");
        setLoading(false);
        return;
      }

      // Find or create job in database (using grant.id as job identifier)
      // For now, we'll use grant.id directly as job_id
      // In a real app, you'd need to map grant.id to actual job_id in jobs table
      // First, try to find if a job exists with this grant id
      let jobId = grant.id;
      
      // Try to find existing job, or create one if it doesn't exist
      const { data: existingJob } = await supabase
        .from("jobs")
        .select("id")
        .eq("id", grant.id)
        .single();

      if (!existingJob) {
        // Job doesn't exist, create it
        const { data: newJob, error: jobError } = await supabase
          .from("jobs")
          .insert({
            id: grant.id,
            professor_id: user.id, // Assuming the current user is the professor (this would need proper logic)
            title: grant.title,
            university: grant.university,
            country: grant.country,
            funding: grant.funding,
            type: grant.type,
            skills: grant.skills,
            degree: grant.degree,
            field: grant.field,
          })
          .select("id")
          .single();

        if (jobError) {
          console.error("Error creating job:", jobError);
          // Continue anyway with grant.id as job_id
        } else if (newJob) {
          jobId = newJob.id;
        }
      }
      
      // Insert application
      const { error: insertError } = await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          student_id: profile.id,
          status: "pending" as const,
          elevator_pitch: elevatorPitch || null,
          portfolio_link: portfolioLink || null,
          // Note: Resume file upload would be handled separately (e.g., upload to storage bucket)
          // For now, we'll just store the filename if a file was selected
          resume_filename: resumeFile?.name || null,
        });

      if (insertError) {
        // If job_id doesn't exist, we might need to create the job first
        // For now, let's handle the error gracefully
        console.error("Error inserting application:", insertError);
        setError("Failed to submit application. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Reset form
      setElevatorPitch("");
      setPortfolioLink("");
      setResumeFile(null);

      // Show success toast and close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onContinueApplication) {
          onContinueApplication();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setElevatorPitch("");
      setPortfolioLink("");
      setResumeFile(null);
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
      onClick={handleClose}
    >
      <div
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Apply to Grant</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Grant Info */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-1">{grant.title}</h4>
            <p className="text-sm text-gray-400">{grant.university} • {grant.professor}</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-teal-500/20 border border-teal-500/30 text-teal-400 text-sm p-4 rounded-lg flex items-center gap-2">
              <CheckCircle2 size={16} />
              Application submitted successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Elevator Pitch */}
            <div>
              <label
                htmlFor="elevatorPitch"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Why you? <span className="text-gray-500">(Max 280 characters)</span>
              </label>
              <textarea
                id="elevatorPitch"
                value={elevatorPitch}
                onChange={(e) => setElevatorPitch(e.target.value)}
                maxLength={280}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
                placeholder="Tell us why you're the perfect fit for this opportunity..."
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {elevatorPitch.length}/280
              </p>
            </div>

            {/* Portfolio Link */}
            <div>
              <label
                htmlFor="portfolioLink"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                GitHub/ResearchGate
              </label>
              <input
                type="url"
                id="portfolioLink"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="https://github.com/yourusername or https://www.researchgate.net/profile/..."
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Resume
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="resume"
                  className="flex items-center gap-3 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition-all"
                >
                  <Upload size={20} className="text-gray-400" />
                  <div className="flex-1">
                    {resumeFile ? (
                      <p className="text-sm text-white">{resumeFile.name}</p>
                    ) : (
                      <p className="text-sm text-gray-400">Upload your resume (PDF, DOC, DOCX)</p>
                    )}
                  </div>
                </label>
              </div>
              {resumeFile && (
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Remove file
                </button>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Note: File upload is currently mocked. Actual file handling will be implemented later.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Submitting..."
                ) : success ? (
                  <>
                    <CheckCircle2 size={16} />
                    Submitted!
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

