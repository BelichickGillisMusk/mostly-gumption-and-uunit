import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LockKeyhole, ShieldCheck, X } from "lucide-react";

interface FooterAdminAccessProps {
  isUnlocked?: boolean;
  onAccessGranted: () => void;
}

export function FooterAdminAccess({
  isUnlocked = false,
  onAccessGranted,
}: FooterAdminAccessProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeDialog = () => {
    setIsOpen(false);
    setPassword("");
    setError("");
    setIsSubmitting(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ password: password.trim() }),
      });

      if (!response.ok) {
        setError("Incorrect password. Please try again.");
        setIsSubmitting(false);
        return;
      }

      onAccessGranted();
      closeDialog();
    } catch {
      setError("Unable to verify access right now. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isUnlocked) {
            onAccessGranted();
            return;
          }

          setIsOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-app-accent/20 bg-app-accent/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-app-accent transition-all hover:bg-app-accent hover:text-white"
      >
        <ShieldCheck className="h-4 w-4" />
        Admin / Owner
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="owner-access-title"
              aria-describedby="owner-access-description"
              className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0B1A2D] p-8 text-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex rounded-sm border border-app-accent/20 bg-app-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-app-accent">
                    Restricted
                  </div>
                  <div>
                    <h2
                      id="owner-access-title"
                      className="text-3xl font-black uppercase tracking-tight"
                    >
                      Owner Access
                    </h2>
                    <p
                      id="owner-access-description"
                      className="mt-2 text-sm text-white/60"
                    >
                      Enter the password to open the admin portal.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDialog}
                  aria-label="Close owner access dialog"
                  className="rounded-full border border-white/10 p-2 text-white/70 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <label className="block space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                    Password
                  </span>
                  <div className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3">
                    <LockKeyhole className="h-4 w-4 text-app-accent" />
                    <input
                      autoFocus
                      type="password"
                      name="owner-password"
                      value={password}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "owner-access-error" : undefined}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) {
                          setError("");
                        }
                      }}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                      placeholder="Enter password"
                    />
                  </div>
                </label>

                {error ? (
                  <p
                    id="owner-access-error"
                    role="alert"
                    className="text-sm font-medium text-[#FF8E72]"
                  >
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-full bg-app-accent px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90"
                  >
                    {isSubmitting ? "Checking..." : "Enter"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDialog}
                    disabled={isSubmitting}
                    className="flex-1 rounded-full border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
