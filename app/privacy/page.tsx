import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Values",
  description:
    "How Values collects, uses, and protects your information, including profile data, location, push notifications, and venue check-ins."
};

const EFFECTIVE_DATE = "June 16, 2026";
const CONTACT_EMAIL = "maxchapin430@gmail.com";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate={EFFECTIVE_DATE}>
      <LegalSection heading="1. Introduction">
        <p>
          Values (&ldquo;Values,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) is a values-based dating app developed and
          operated by Maxwell Chapin. This Privacy Policy explains what
          information we collect through the Values mobile application (the
          &ldquo;App&rdquo;), how we use and share it, and the choices you
          have. By creating an account or otherwise using the App, you agree
          to the practices described in this policy.
        </p>
      </LegalSection>

      <LegalSection heading="2. Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-slate-900">
              Profile information.
            </span>{" "}
            Information you provide when creating or updating your profile,
            such as your name, date of birth, gender, photos, bio, dating
            preferences, relationship goals, and the personal values you
            select or rank as part of our matching process.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Account credentials.
            </span>{" "}
            Your email address and authentication details, processed through
            our backend provider, Supabase.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Location information.
            </span>{" "}
            With your permission, we collect precise or approximate location
            data from your device. We use this to show you nearby venues, to
            power QR code venue check-ins, and to detect when you and another
            user have overlapped at the same venue so we can surface a
            potential match. You can disable location access in your device
            settings, but doing so will limit or disable these features.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Push notification tokens.
            </span>{" "}
            If you enable notifications, we collect a device push token
            (issued through Expo&rsquo;s push notification service) so we can
            send you alerts, including notifications about match overlaps at
            venues.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Check-in and venue history.
            </span>{" "}
            When you scan a venue QR code or check in at a location, we
            record the venue, the time of your check-in, and which other
            users were checked in at the same venue during an overlapping
            window.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Usage and device information.
            </span>{" "}
            Information about how you use the App, such as swipes, likes,
            matches, and message metadata, as well as device type, operating
            system, app version, and crash or diagnostic logs.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Communications.
            </span>{" "}
            If you contact us for support or feedback, we collect the
            contents of that communication and your contact details.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How We Use Your Information">
        <p>We use the information described above to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Create and maintain your account and profile;</li>
          <li>
            Calculate compatibility and surface matches based on shared
            values and preferences;
          </li>
          <li>
            Operate venue check-ins and detect when you and another user have
            overlapped at the same venue;
          </li>
          <li>
            Send push notifications, including alerts about match overlaps
            and other account-related activity;
          </li>
          <li>Maintain the safety, security, and integrity of the App;</li>
          <li>
            Investigate and respond to reports of abuse, harassment, or
            violations of our Terms of Service;
          </li>
          <li>Respond to support requests and feedback; and</li>
          <li>
            Analyze, maintain, and improve the App&rsquo;s features and
            performance.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. How We Share Your Information">
        <p>
          We do not sell your personal information. We share information in
          the following circumstances:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-slate-900">
              With other users.
            </span>{" "}
            Your profile information (such as your photos, bio, and shared
            values) is visible to other users as part of the App&rsquo;s
            discovery and matching flow. If you check in at a venue,
            information about that overlap may be shared with other users who
            checked in during the same window.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Service providers.
            </span>{" "}
            We use third-party services to operate the App, including:
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-slate-900">
                  Supabase,
                </span>{" "}
                which provides our database, authentication, and file storage
                infrastructure and stores most of the data described in this
                policy on our behalf.
              </li>
              <li>
                <span className="font-semibold text-slate-900">
                  Expo,
                </span>{" "}
                which provides the push notification infrastructure we use to
                deliver alerts to your device. Expo may relay your device
                push token to Apple Push Notification service (APNs) or
                Firebase Cloud Messaging (FCM) as applicable to your device.
              </li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Legal and safety reasons.
            </span>{" "}
            We may disclose information if required by law, legal process, or
            government request, or if we believe disclosure is necessary to
            protect the rights, property, or safety of Values, our users, or
            the public, or to investigate fraud, security, or technical
            issues.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Business transfers.
            </span>{" "}
            If Values is involved in a merger, acquisition, financing, or sale
            of assets, your information may be transferred as part of that
            transaction.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Data Retention">
        <p>
          We retain your information for as long as your account remains
          active. If you delete your account, we will delete or anonymize
          your personal information within a reasonable period, generally
          within 30 days, except where we are required to retain certain
          information for longer to comply with legal obligations, resolve
          disputes, investigate misconduct or abuse, or enforce our
          agreements.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your Rights and Choices">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-slate-900">
              Access and correction.
            </span>{" "}
            You can review and update most of your profile information
            directly within the App.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Account and data deletion.
            </span>{" "}
            You can delete your account from within the App, or by emailing
            us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-indigo-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            . We will delete your personal information as described in
            Section 5 above.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Location and notification permissions.
            </span>{" "}
            You can enable or disable location services and push
            notifications at any time through your device settings. Disabling
            these permissions may limit features such as venue check-ins and
            match overlap alerts.
          </li>
          <li>
            <span className="font-semibold text-slate-900">
              Questions and requests.
            </span>{" "}
            You may contact us at any time with questions about your
            information or to make a request regarding your data.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="7. Children's Privacy">
        <p>
          Values is intended only for users who are at least 18 years old. We
          do not knowingly collect personal information from anyone under 18.
          If we learn that we have collected information from a user under
          18, we will delete that information and terminate the associated
          account.
        </p>
      </LegalSection>

      <LegalSection heading="8. Data Security">
        <p>
          We use reasonable technical and organizational measures designed to
          protect your information from unauthorized access, loss, misuse, or
          alteration. However, no method of transmission or storage is
          completely secure, and we cannot guarantee absolute security of
          your information.
        </p>
      </LegalSection>

      <LegalSection heading="9. International Data Transfers">
        <p>
          Our service providers, including Supabase and Expo, may store and
          process information in the United States or other countries. By
          using the App, you understand that your information may be
          transferred to and processed in countries other than the one in
          which you reside, which may have different data protection laws.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. If we make
          material changes, we will update the effective date above and, where
          appropriate, notify you through the App or by email. Your continued
          use of the App after a change takes effect constitutes your
          acceptance of the revised policy.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact Us">
        <p>
          If you have questions about this Privacy Policy or how we handle
          your information, contact:
        </p>
        <p>
          Maxwell Chapin
          <br />
          Values
          <br />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-indigo-600 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
