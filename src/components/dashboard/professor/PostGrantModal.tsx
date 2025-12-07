"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/lib/supabase/types";

interface PostGrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostGrantModal({
  isOpen,
  onClose,
  onSuccess,
}: PostGrantModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    funding: "",
    university: "",
    country: "",
    skills: "",
    description: "",
    type: "Full Funding",
    degree: "PhD" as "MS" | "PhD",
    field: "",
  });
  const [enableTryout, setEnableTryout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Fetch profile to auto-fill university
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("university")
          .eq("user_id", user.id)
          .single();

        if (data?.university) {
          setProfile(data);
          setFormData((prev) => ({ ...prev, university: data.university || "" }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (!formData.title || !formData.funding || !formData.university) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Insert into jobs table
      const { error: insertError } = await supabase
        .from("jobs")
        .insert({
          professor_id: user.id,
          title: formData.title,
          university: formData.university,
          country: formData.country || "Unknown",
          funding: formData.funding,
          type: formData.type,
          skills: skillsArray,
          degree: formData.degree,
          field: formData.field || "Research",
          description: formData.description || null,
          tryout: enableTryout || false,
        });

      if (insertError) {
        console.error("Error posting job:", insertError);
        setError(insertError.message || "Failed to post opportunity");
        setLoading(false);
        return;
      }

      // Reset form
      setFormData({
        title: "",
        funding: "",
        university: profile?.university || "",
        country: "",
        skills: "",
        description: "",
        type: "Full Funding",
        degree: "PhD",
        field: "",
      });
      setEnableTryout(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to post opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Post New Opportunity</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
              placeholder="e.g., PhD Position in Machine Learning"
              required
            />
          </div>

          {/* Funding Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Funding Amount *
            </label>
            <input
              type="text"
              value={formData.funding}
              onChange={(e) =>
                setFormData({ ...formData, funding: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
              placeholder="e.g., $50k per year"
              required
            />
          </div>

          {/* University (Auto-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              University *
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) =>
                setFormData({ ...formData, university: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
              placeholder="e.g., MIT"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
              placeholder="e.g., USA"
            />
          </div>

          {/* Skills (Tags) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
              placeholder="e.g., Python, Machine Learning, Deep Learning"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 resize-none"
              placeholder="Describe the research opportunity..."
            />
          </div>

          {/* Type and Degree */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500/50"
              >
                <option value="Full Funding">Full Funding</option>
                <option value="Partial">Partial</option>
                <option value="Research Assistantship">Research Assistantship</option>
                <option value="Self-Funded">Self-Funded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Degree
              </label>
              <select
                value={formData.degree}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    degree: e.target.value as "MS" | "PhD",
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500/50"
              >
                <option value="PhD">PhD</option>
                <option value="MS">MS</option>
              </select>
            </div>
          </div>

          {/* Enable Research Tryout Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="enableTryout"
              checked={enableTryout}
              onChange={(e) => setEnableTryout(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
            />
            <label htmlFor="enableTryout" className="text-sm text-gray-300">
              Enable Research Tryout?
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium py-3 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

