import type { ReactNode } from "react";
import Link from "next/link";

const CONTACT_EMAIL = "maxchapin430@gmail.com";

interface LegalPageProps {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}

export default function LegalPage({
  title,
  effectiveDate,
  children
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4 border-b border-slate-700/50 pb-6">
          <Link
            href="/"
            className="text-xs font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
          >
            ← Back to Values
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-600 text-xs font-extrabold text-white shadow-sm">
              V
            </div>
            <span className="text-xs font-semibold tracking-wide text-slate-400">
              Values
            </span>
          </div>
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Effective date: {effectiveDate}
          </p>
        </div>

        <article className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm sm:p-8">
          {children}
        </article>

        <footer className="mt-10 border-t border-slate-700/50 pt-6 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Values. Boston-first.</p>
          <p className="mt-2">
            Questions about this {title.toLowerCase()}? Contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-indigo-300 hover:text-indigo-200 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}

export function LegalSection({
  heading,
  children
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
        {heading}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </section>
  );
}
