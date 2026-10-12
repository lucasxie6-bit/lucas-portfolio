"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL, INBOX } from "@/components/records";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl bg-[#E5E1DA] px-4 text-[16px] text-[#1C191B] placeholder:text-[#8A847A] border-[1.5px] border-transparent outline-none transition-colors focus:bg-[#F7F5F0] focus:border-[#1C191B]";

// Every message is delivered to INBOX by FormSubmit (https://formsubmit.co). The very first message triggers a one-time
// "activate form" email to that inbox; nothing arrives until that link is clicked.
const ENDPOINT = `https://formsubmit.co/ajax/${INBOX}`;

// The "say hi" popup. Any link to my email opens it instead of the mail app; the link still works without JavaScript.
export default function SayHi() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(INBOX);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked: the address is still on screen to select by hand.
    }
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.(`a[href^="${EMAIL}"]`);
      if (!link) return;
      e.preventDefault();
      setStatus("idle");
      dialogRef.current?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => dialogRef.current?.close();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email, // FormSubmit uses this as the reply-to address
          message: data.message,
          _subject: `say hi from ${data.name}`,
          _template: "box",
          _captcha: "false",
          _honey: data._honey,
        }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || String(result?.success) !== "true") throw new Error(result?.message ?? String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="say-hi-title"
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto w-[calc(100%-32px)] max-w-[440px] rounded-[28px] bg-[#F2F0EB] p-0 text-[#1C191B] shadow-[0_30px_80px_-30px_rgba(28,25,27,0.6)] backdrop:bg-[#1C191B]/35 backdrop:backdrop-blur-md open:animate-[sayHiIn_0.25s_ease-out]"
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lx-icon.svg" alt="" width={44} height={44} className="size-11 shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 id="say-hi-title" className="text-[20px] font-bold leading-tight">
              say hi
            </h2>
            <p className="text-[14px] text-[#8A847A]">it goes straight to my inbox</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid place-items-center size-8 shrink-0 rounded-full bg-[#E5E1DA] hover:bg-[#DAD5CC] transition-colors cursor-pointer"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M2 2l6 6M8 2l-6 6" />
            </svg>
          </button>
        </div>

        {status === "sent" ? (
          <div className="mt-8 mb-2">
            <p className="text-[16px] font-bold">got it, thanks.</p>
            <p className="mt-1 text-[14px] text-[#6B655C]">i&apos;ll write back soon.</p>
            <button
              type="button"
              onClick={close}
              className="mt-6 w-full h-12 rounded-xl bg-[#1C191B] text-[#F2F0EB] text-[15px] font-bold hover:bg-[#3A3533] transition-colors cursor-pointer"
            >
              close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block mb-1.5 text-[13px] font-bold">name</span>
                <input name="name" required maxLength={100} autoComplete="name" placeholder="your name" className={`${field} h-11`} />
              </label>
              <label className="block">
                <span className="block mb-1.5 text-[13px] font-bold">email</span>
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoCapitalize="off"
                  required
                  maxLength={200}
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={`${field} h-11`}
                />
              </label>
            </div>
            <label className="block mt-3">
              <span className="block mb-1.5 text-[13px] font-bold">message</span>
              <textarea name="message" required maxLength={5000} rows={5} placeholder="your message" className={`${field} py-3 resize-none`} />
            </label>
            {/* Honeypot: hidden from people, filled in by bots */}
            <input name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            {status === "error" && (
              <p className="mt-3 text-[13px] text-[#B4412F]">
                that didn&apos;t send. try again, or email me at{" "}
                <a href={`${EMAIL}?subject=hi`} className="underline">
                  {INBOX}
                </a>
                .
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-5 w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C191B] text-[#F2F0EB] text-[15px] font-bold hover:bg-[#3A3533] disabled:opacity-60 transition-colors cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
              </svg>
              {status === "sending" ? "sending…" : "send"}
            </button>

            <p className="mt-4 text-center text-[13px] text-[#8A847A]">
              or copy my email:{" "}
              <button
                type="button"
                onClick={copyEmail}
                title="Copy email address"
                className="inline-flex items-center gap-1.5 font-bold text-[#1C191B] hover:text-[#6B655C] transition-colors cursor-pointer"
              >
                <span aria-live="polite">{copied ? "copied ✓" : INBOX}</span>
                {!copied && (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <rect x="5" y="5" width="9" height="9" rx="2" />
                    <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
                  </svg>
                )}
              </button>
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
