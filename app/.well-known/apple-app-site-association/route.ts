import { NextResponse } from "next/server";

export function GET() {
  const aasa = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "833N8FN96J.com.values.app",
          paths: ["/checkin*"],
        },
      ],
    },
  };

  return new NextResponse(JSON.stringify(aasa), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
