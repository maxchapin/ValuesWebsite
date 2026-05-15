// Android Digital Asset Links — not needed until Android launch.
// Uncomment and fill in package name + SHA-256 fingerprint when ready.

// import { NextResponse } from "next/server";
//
// export function GET() {
//   const assetlinks = [
//     {
//       relation: ["delegate_permission/common.handle_all_urls"],
//       target: {
//         namespace: "android_app",
//         package_name: "[YOUR_ANDROID_PACKAGE]",
//         sha256_cert_fingerprints: ["[YOUR_SHA256_FINGERPRINT]"],
//       },
//     },
//   ];
//
//   return new NextResponse(JSON.stringify(assetlinks), {
//     headers: {
//       "Content-Type": "application/json",
//       "Cache-Control": "public, max-age=3600",
//     },
//   });
// }
