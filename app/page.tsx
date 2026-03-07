"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type L from "leaflet";

type AgeRange = "21-24" | "25-29" | "30-34" | "35-39" | "40+";
type RelationshipGoal = "serious" | "open" | "unsure";
type AbVariant = "A" | "B";
type BillingCycle = "monthly" | "annually";

interface WaitlistFormData {
  email: string;
  firstName: string;
  ageRange: AgeRange;
  relationshipGoal: RelationshipGoal;
  frustrations: string;
}

type FunnelEventName =
  | "pageview_variant"
  | "pricing_viewed"
  | "get_started_clicked"
  | "checkout_completed";

type FunnelEvent = {
  name: FunnelEventName;
  ts: number;
  variant: AbVariant;
  price_point_monthly: number;
  meta?: Record<string, unknown>;
};

const currentYear = new Date().getFullYear();

function scrollToWaitlist() {
  if (typeof document !== "undefined") {
    const el = document.getElementById("waitlist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((p) => p.trim());
  const hit = parts.find((p) => p.startsWith(`${name}=`));
  if (!hit) return null;
  return decodeURIComponent(hit.slice(name.length + 1));
}

function setCookieValue(name: string, value: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function readVariantFromStorage(): AbVariant | null {
  const fromCookie = getCookieValue("ab_variant");
  if (fromCookie === "A" || fromCookie === "B") return fromCookie;
  if (typeof window === "undefined") return null;
  const fromLocal = window.localStorage.getItem("ab_variant");
  if (fromLocal === "A" || fromLocal === "B") return fromLocal;
  return null;
}

function persistVariant(variant: AbVariant) {
  setCookieValue("ab_variant", variant);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("ab_variant", variant);
  }
}

function bumpLocalStats(event: FunnelEvent) {
  if (typeof window === "undefined") return;
  const key = "wv_ab_stats_v1";
  const raw = window.localStorage.getItem(key);
  let parsed: Record<string, number> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw) as Record<string, number>;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        "[WickedValues:funnel] Failed to parse local stats, resetting.",
        error
      );
      parsed = {};
    }
  }
  const base = `${event.name}|v=${event.variant}|p=${event.price_point_monthly}`;
  parsed[base] = (parsed[base] ?? 0) + 1;
  window.localStorage.setItem(key, JSON.stringify(parsed));
}

function trackEvent(event: FunnelEvent) {
  // eslint-disable-next-line no-console
  console.log("[WickedValues:funnel]", event.name, event);
  bumpLocalStats(event);
}

const WaitlistForm: React.FC<{ prefillEmail?: string }> = ({
  prefillEmail
}) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: "",
    firstName: "",
    ageRange: "25-29",
    relationshipGoal: "serious",
    frustrations: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!prefillEmail) return;
    setFormData((prev) => (prev.email ? prev : { ...prev, email: prefillEmail }));
  }, [prefillEmail]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: tracking for waitlist signups
    console.log("Wicked Values waitlist submission:", formData);

    setIsSubmitted(true);
  };

  return (
    <div className="mt-8">
      {!isSubmitted && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-900"
              >
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-900"
              >
                First name (optional)
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Max"
              />
            </div>

            <div>
              <label
                htmlFor="ageRange"
                className="block text-sm font-medium text-slate-900"
              >
                Age range
              </label>
              <select
                id="ageRange"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="21-24">21–24</option>
                <option value="25-29">25–29</option>
                <option value="30-34">30–34</option>
                <option value="35-39">35–39</option>
                <option value="40+">40+</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="relationshipGoal"
                className="block text-sm font-medium text-slate-900"
              >
                What are you looking for?
              </label>
              <select
                id="relationshipGoal"
                name="relationshipGoal"
                value={formData.relationshipGoal}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="serious">Serious relationship</option>
                <option value="open">Open to something serious</option>
                <option value="unsure">Not sure</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="frustrations"
                className="block text-sm font-medium text-slate-900"
              >
                What frustrates you most about dating apps right now?{" "}
                <span className="text-slate-500">(optional)</span>
              </label>
              <textarea
                id="frustrations"
                name="frustrations"
                rows={4}
                value={formData.frustrations}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Be honest – this helps us build something better."
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              Join the waitlist
            </button>
            <p className="text-xs text-slate-500">
              No spam. We&apos;ll only email you about Wicked Values.
            </p>
          </div>
        </form>
      )}

      {isSubmitted && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900 sm:p-8">
          <p className="font-semibold">Thank you for joining the waitlist.</p>
          <p className="mt-1">
            We&apos;ll be in touch as we get closer to launching Wicked Values
            in Boston—and we may reach out for your perspective as we shape the
            first version.
          </p>
        </div>
      )}
    </div>
  );
};

const MapBackground: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");

      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [42.32, -71.06],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: ""
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    void initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-30 [filter:grayscale(1)_contrast(1.1)]"
    />
  );
};

const HomePage: React.FC = () => {
  const [variant, setVariant] = useState<AbVariant | null>(null);
  const [heroEmail, setHeroEmail] = useState("");
  const router = useRouter();

  const resolvedVariant: AbVariant = variant ?? "A";
  const monthlyPrice = resolvedVariant === "A" ? 12 : 22;

  useEffect(() => {
    const v = readVariantFromStorage() ?? (Math.random() < 0.5 ? "A" : "B");
    setVariant(v);
    persistVariant(v);

    trackEvent({
      name: "pageview_variant",
      ts: Date.now(),
      variant: v,
      price_point_monthly: v === "A" ? 12 : 22
    });
  }, []);

  return (
    <main className="relative min-h-screen text-slate-50">
      <MapBackground />
      <div className="pointer-events-none fixed inset-0 z-10 bg-slate-950/60" />
      {/* Page container */}
      <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        {/* Header / Hero */}
        <header className="mb-10 border-b border-slate-700/50 pb-6 sm:pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm">
                WV
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                Wicked Values
              </span>
            </div>
            <button
              onClick={scrollToWaitlist}
              className="hidden rounded-full border border-slate-500/70 bg-slate-900/60 px-4 py-1.5 text-xs font-medium text-slate-100 shadow-sm transition hover:border-indigo-400 hover:text-white sm:inline-flex"
            >
              Join waitlist
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-16">
          {/* Hero Section */}
          <section className="flex flex-col items-center text-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/60 bg-slate-900/60 px-3 py-1 text-xs font-medium text-indigo-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Launching soon in Boston
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                Boston dates for people with wicked high standards.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base mx-auto">
                A values-first dating app that connects Boston singles through
                aligned beliefs and curated real-life events.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  className="w-full max-w-xs rounded-full border border-slate-500/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-50 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:max-w-sm"
                />
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={scrollToWaitlist}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    Join the waitlist
                  </button>
                  <button
                    onClick={() => router.push("/premium")}
                    className="text-sm font-medium text-indigo-100 underline-offset-4 hover:underline"
                  >
                    Get Premium for ${monthlyPrice}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-300">
                Built for Boston singles who care more about values, effort, and
                real-life connection than just another swipe.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-50 sm:text-2xl">
                How Wicked Values works
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                Not another mindless swipe machine. Wicked Values keeps things
                simple and intentional.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg">
                  📝
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Share your values
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Choose your top 5, 10, and 20 relationship values.
                </p>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg">
                  🧭
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  See aligned Boston singles
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  We highlight people who share your values and dating preferences.
                  goals.
                </p>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg">
                  ☕
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Meet at curated IRL events
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Coming soon: From coffee meetups to small gatherings, we create ways to
                  meet off-screen.
                </p>
              </div>
            </div>
          </section>

          {/* Why this exists / Founder note */}
          <section className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold tracking-tight text-slate-50 sm:text-2xl">
                Built for Boston singles with standards
              </h2>
              <p className="mt-2 text-sm text-slate-200">
                If you&apos;re serious about who you spend your time with, the
                average dating app can feel like a bad fit.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-indigo-300">•</span>
                  <span>
                    Tired of endless swiping and low-effort matches.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-indigo-300">•</span>
                  <span>
                    Done wasting time with people who don&apos;t share your
                    values.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-indigo-300">•</span>
                  <span>
                    Want real-life connection, not just another chat that goes
                    nowhere.
                  </span>
                </li>
              </ul>
            </div>

            {/*<div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  M
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Max, Founder of Wicked Values
                  </p>
                  <p className="text-xs text-slate-500">
                    Building in Boston, for Boston.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-700">
                I kept meeting thoughtful, values-driven people in Boston who
                were exhausted by apps that feel more like games than tools for
                building a real relationship. Wicked Values is my attempt to
                flip that script—less swiping, more alignment, and more chances
                to actually meet in person.
              </p>
            </div> */}
          </section>

          {/* Early member benefits + form container */}
          <section
            id="waitlist"
            className="rounded-3xl bg-indigo-50/80 px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
          >
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] lg:items-start">
                {/* Early access benefits */}
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Join the early access list
                  </h2>
                  <p className="mt-2 text-sm text-slate-700">
                    Help us test Wicked Values in Boston and shape how a
                    values-first dating app should actually work.
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-slate-900">
                    <li className="flex gap-2">
                      <span className="mt-0.5 text-indigo-600">✓</span>
                      <span>Priority access when we launch in Boston.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 text-indigo-600">✓</span>
                      <span>Invites to early Wicked Values IRL meetups.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 text-indigo-600">✓</span>
                      <span>Shaping features based on your feedback.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 text-indigo-600">✓</span>
                      <span>A say in how we build a better dating culture.</span>
                    </li>
                  </ul>

                  <p className="mt-4 text-xs text-slate-600">
                    We&apos;re keeping this first group intentionally small so we
                    can actually listen, iterate, and build something that works
                    for Boston—not just for a pitch deck.
                  </p>
                </div>

                {/* Waitlist / application form */}
                <div>
                  <WaitlistForm prefillEmail={heroEmail} />
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-50 sm:text-2xl">
                FAQ
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm sm:p-5">
                <p className="font-semibold text-slate-900">
                  Is Wicked Values live yet?
                </p>
                <p className="mt-1 text-slate-600">
                  We&apos;re currently building and launching first in Boston.
                  Join the waitlist to be part of the very first group.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm sm:p-5">
                <p className="font-semibold text-slate-900">Is it free?</p>
                <p className="mt-1 text-slate-600">
                  Early access will be free while we learn what works best. If
                  we ever charge for anything, you&apos;ll be the first to
                  know—and you&apos;ll help us design it.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm sm:p-5">
                <p className="font-semibold text-slate-900">
                  How is this different from other apps?
                </p>
                <p className="mt-1 text-slate-600">
                  Wicked Values starts with your non-negotiables and
                  life-orientation, then focuses on curated IRL experiences
                  instead of endless chatting. Less noise, more meaningful
                  matches and chances to actually meet.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm sm:p-5">
                <p className="font-semibold text-slate-900">
                  When are you launching?
                </p>
                <p className="mt-1 text-slate-600">
                  We&apos;re aiming for later this year. Timelines might flex as
                  we learn, but joining the waitlist is the best way to stay in
                  the loop and get invited to early meetups.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-700/50 pt-6 text-xs text-slate-300 sm:mt-16 sm:pt-8">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p>© {currentYear} Wicked Values</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="hover:text-slate-100 hover:underline underline-offset-2"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-slate-100 hover:underline underline-offset-2"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-slate-100 hover:underline underline-offset-2"
              >
                Contact
              </a>
              <span className="text-slate-400">Made in Boston.</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default HomePage;
