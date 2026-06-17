import { createClient } from "@supabase/supabase-js";

// Replace with actual App Store link when live
const APP_STORE_URL = "https://testflight.apple.com/join/1gRm2NvK";
// const PLAY_STORE_URL = "#"; // Android — not needed yet

interface PageProps {
  searchParams: { token?: string };
}

async function fetchVenueName(token: string): Promise<string | null> {
  console.log("[checkin] fetchVenueName called with token:", JSON.stringify(token));
  console.log("[checkin] token length:", token.length, "| chars:", [...token].map(c => c.charCodeAt(0)));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("[checkin] SUPABASE_URL present:", !!url, "| ANON_KEY present:", !!key);

  if (!url || !key) {
    console.error("[checkin] Missing Supabase env vars — aborting lookup");
    return null;
  }

  const supabase = createClient(url, key);
  console.log("[checkin] Querying venues table for token:", JSON.stringify(token));

  const { data, error, status, statusText } = await supabase
    .from("venues")
    .select("name")
    .eq("token", token)
    .single();

  console.log("[checkin] Supabase response — status:", status, statusText);
  console.log("[checkin] Supabase data:", JSON.stringify(data));
  if (error) {
    console.error("[checkin] Supabase error:", JSON.stringify(error));
  }

  const result = data?.name ?? null;
  console.log("[checkin] Resolved venue name:", result);
  return result;
}

export default async function CheckinPage({ searchParams }: PageProps) {
  const rawToken = searchParams.token;
  const token = rawToken ?? "";
  console.log("[checkin] Page hit — raw token from URL:", JSON.stringify(rawToken));
  console.log("[checkin] Sanitised token:", JSON.stringify(token), "| empty?", token === "");

  const venueName = token ? await fetchVenueName(token) : null;
  console.log("[checkin] Final venueName:", venueName, "| will show:", venueName ? "venue found" : token ? "invalid token" : "no token");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-slate-50">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-extrabold text-white shadow-lg">
            V
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-400">
            Values
          </span>
        </div>

        {/* Location pin */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-12 w-12 text-indigo-400"
          >
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.218-4.512 3.218-7.327a6.5 6.5 0 00-13 0c0 2.815 1.274 5.248 3.218 7.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Main message */}
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
            You were spotted at
          </p>

          {venueName ? (
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              {venueName}
            </h1>
          ) : (
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-400">
              {token ? "This link isn't valid" : "No check-in token found"}
            </h1>
          )}

          {venueName && (
            <p className="text-base text-slate-300">
              Download Values to connect with people who were there too.
            </p>
          )}
        </div>

        {/* Download buttons — only shown when venue resolves */}
        {venueName && (
          <div className="flex flex-col gap-3">
            <a
              href={APP_STORE_URL}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-slate-900 shadow-sm transition hover:bg-slate-100 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 shrink-0"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] font-medium leading-none text-slate-500">
                  Download on the
                </p>
                <p className="text-base font-bold leading-tight">App Store</p>
              </div>
            </a>

            {/* Google Play button — add when Android launches */}
            {/* <a
              href={PLAY_STORE_URL}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-slate-900 shadow-sm transition hover:bg-slate-100 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 shrink-0"
              >
                <path d="M3.18 23.76c.3.17.64.22.99.14l13.24-7.46-2.9-2.9-11.33 10.22zm-1.62-20.4C1.22 3.7 1 4.1 1 4.61v14.78c0 .51.22.91.56 1.25l.07.06 8.28-8.27v-.2L1.56 3.3l-.01.06zm18.52 8.7l-2.68-1.51-3.01 3.01 3.01 3.01 2.69-1.52c.77-.43.77-1.14 0-1.57l-.01.08zM4.17.24L17.41 7.7l-2.9 2.9L3.18.38C3.48.21 3.82.16 4.17.24z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] font-medium leading-none text-slate-500">
                  Get it on
                </p>
                <p className="text-base font-bold leading-tight">Google Play</p>
              </div>
            </a> */}
          </div>
        )}

        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Values. Boston-first.
        </p>
      </div>
    </main>
  );
}
