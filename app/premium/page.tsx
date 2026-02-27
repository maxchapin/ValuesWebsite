"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type L from "leaflet";

type AbVariant = "A" | "B";
type BillingCycle = "monthly" | "annually";

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

const PremiumPage: React.FC = () => {
  const router = useRouter();

  const [variant, setVariant] = useState<AbVariant | null>(() =>
    readVariantFromStorage()
  );
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>("monthly");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  const resolvedVariant: AbVariant = variant ?? "A";
  const monthlyPrice = resolvedVariant === "A" ? 12 : 22;
  const annualPrice = monthlyPrice * 10;

  useEffect(() => {
    const v = readVariantFromStorage() ?? (Math.random() < 0.5 ? "A" : "B");
    setVariant(v);
    persistVariant(v);

    const baseEvent: FunnelEvent = {
      name: "pageview_variant",
      ts: Date.now(),
      variant: v,
      price_point_monthly: v === "A" ? 12 : 22
    };
    trackEvent(baseEvent);

    trackEvent({
      name: "pricing_viewed",
      ts: Date.now(),
      variant: v,
      price_point_monthly: v === "A" ? 12 : 22
    });
  }, []);

  function openCheckout(cycle: BillingCycle) {
    setCheckoutCompleted(false);
    setSelectedCycle(cycle);
    trackEvent({
      name: "get_started_clicked",
      ts: Date.now(),
      variant: resolvedVariant,
      price_point_monthly: monthlyPrice,
      meta: { cycle }
    });
    if (typeof document !== "undefined") {
      document.getElementById("checkout")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function selectedPriceText() {
    return selectedCycle === "monthly"
      ? `$${monthlyPrice}/month`
      : `$${annualPrice}/year`;
  }

  function handleCheckoutSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCheckoutCompleted(true);
    trackEvent({
      name: "checkout_completed",
      ts: Date.now(),
      variant: resolvedVariant,
      price_point_monthly: monthlyPrice,
      meta: {
        selectedCycle,
        selectedPriceText: selectedPriceText()
      }
    });
  }

  return (
    <main className="relative min-h-screen text-slate-50">
      <MapBackground />
      <div className="pointer-events-none fixed inset-0 z-10 bg-slate-950/60" />

      <div className="relative z-20 mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <header className="mb-8 flex items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xs font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
          >
            ← Back to Wicked Values
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
              WV
            </div>
            <span className="text-xs font-semibold tracking-tight text-slate-50">
              Wicked Values · Premium
            </span>
          </div>
        </header>

        <div className="flex-1 space-y-8">
          <section className="max-w-2xl space-y-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-3xl">
              Founding member pricing
            </h1>
            <p className="text-sm text-slate-200">
              We&apos;re exploring what serious, values-first dating in Boston is
              worth. Choose a plan below to reserve your spot—no payment
              collected today.
            </p>
            <p className="text-xs text-slate-400">
              You&apos;re seeing variant{" "}
              <span className="font-semibold text-slate-200">
                {resolvedVariant}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-slate-200">
                ${monthlyPrice}/month
              </span>
              .
            </p>
          </section>

          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="animate-[fadeIn_450ms_ease-out] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Monthly
                    </p>
                    <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                      ${monthlyPrice}
                      <span className="text-sm font-semibold text-slate-500">
                        /mo
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Billed monthly
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
                    Founding pricing
                  </span>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li>Unlimited values-based matching</li>
                  <li>4 IRL events/month</li>
                  <li>Priority event access</li>
                  <li>Advanced filters</li>
                </ul>

                <button
                  onClick={() => openCheckout("monthly")}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Get Started
                </button>
              </div>

              <div className="animate-[fadeIn_650ms_ease-out] rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Annual
                    </p>
                    <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                      ${annualPrice}
                      <span className="text-sm font-semibold text-slate-500">
                        /yr
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Billed annually (2 months free)
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    Best value
                  </span>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li>Unlimited values-based matching</li>
                  <li>4 IRL events/month</li>
                  <li>Priority event access</li>
                  <li>Advanced filters</li>
                </ul>

                <button
                  onClick={() => openCheckout("annually")}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                >
                  Get Started
                </button>
              </div>
            </div>
          </section>

          <section
            id="checkout"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            {!checkoutCompleted ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Step 1 of 1
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                      Reserve founding member pricing
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Selected:{" "}
                      <span className="font-semibold text-slate-900">
                        {selectedPriceText()}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedCycle("monthly")}
                      className={`rounded-full px-3 py-1 font-semibold ${
                        selectedCycle === "monthly"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Billing monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCycle("annually")}
                      className={`rounded-full px-3 py-1 font-semibold ${
                        selectedCycle === "annually"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Annually
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-900">
                        Name
                      </label>
                      <input
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900">
                        Email
                      </label>
                      <input
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        required
                        type="email"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                      You&apos;re reserving:{" "}
                      <span className="font-semibold text-slate-900">
                        {selectedPriceText()}
                      </span>
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    >
                      Complete checkout
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    This is coming soon. No payment is collected.
                  </p>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Thanks! You&apos;ve reserved founding member pricing.
                    </p>
                    <p className="text-sm text-slate-600">
                      Reserved at{" "}
                      <span className="font-semibold text-slate-900">
                        {selectedPriceText()}
                      </span>
                      . We&apos;ll email before launch.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Share with a friend who hates swiping
                  </p>
                  <p className="mt-1">
                    Tell them to join the waitlist—Boston-first, values-first,
                    IRL-forward.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default PremiumPage;

