import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | The Local",
  description:
    "The terms and conditions that govern your use of The Local mobile app."
};

const EFFECTIVE_DATE = "June 16, 2026";
const CONTACT_EMAIL = "maxchapin430@gmail.com";

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" effectiveDate={EFFECTIVE_DATE}>
      <LegalSection heading="1. Acceptance of Terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) form a binding
          agreement between you and Maxwell Chapin, the developer and
          operator of The Local (&ldquo;The Local,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to
          and use of The Local mobile application (the &ldquo;App&rdquo;).
          By creating an account or otherwise using the App, you agree to be
          bound by these Terms. If you do not agree, do not use the App.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <p>
          You must be at least 18 years old to create an account or use the
          App. By using the App, you represent and warrant that you are at
          least 18 years old, that you have the legal capacity to enter into
          these Terms, and that you are not prohibited from using the App
          under the laws of your jurisdiction. You may maintain only one
          account and must provide accurate, current information about
          yourself.
        </p>
      </LegalSection>

      <LegalSection heading="3. Account Registration and Security">
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activity that occurs under your
          account. Notify us immediately at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-indigo-600 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          if you suspect unauthorized use of your account.
        </p>
      </LegalSection>

      <LegalSection heading="4. The Service">
        <p>
          The Local helps users discover and connect with people they&rsquo;ve
          crossed paths with in real life, and offers features such as a
          discovery/matching flow, QR code venue check-ins, and push
          notifications when your check-in history overlaps with another
          user&rsquo;s at the same venue. We may add, change, suspend, or
          discontinue any feature of the App at any time, with or without
          notice.
        </p>
        <p className="font-semibold text-slate-900">
          We do not guarantee that you will be matched with anyone, that any
          match will result in a conversation, meeting, or relationship, or
          that any particular feature (including venue check-ins or overlap
          notifications) will function without interruption or error.
        </p>
      </LegalSection>

      <LegalSection heading="5. Acceptable Use">
        <p>
          You agree to use the App only for its intended purpose and in
          compliance with all applicable laws. You agree to provide accurate
          information in your profile and to treat other users with respect.
        </p>
      </LegalSection>

      <LegalSection heading="6. Prohibited Conduct">
        <p>You agree not to, and not to assist others to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Harass, threaten, stalk, abuse, intimidate, or demean any other
            user;
          </li>
          <li>
            Create a fake profile, impersonate any person or entity, or
            misrepresent your identity, age, or affiliation with any person
            or organization;
          </li>
          <li>
            Maintain more than one account, or create a new account after
            being suspended or terminated, without our permission;
          </li>
          <li>
            Use the App for any commercial solicitation, advertising, or
            spam, including soliciting money or financial information from
            other users;
          </li>
          <li>
            Post or share content that is unlawful, obscene, defamatory,
            hateful, or that infringes another person&rsquo;s intellectual
            property or privacy rights, including sharing another
            person&rsquo;s photos or personal information without their
            consent;
          </li>
          <li>
            Use any bot, scraper, crawler, or other automated means to access
            the App or extract data from it;
          </li>
          <li>
            Attempt to circumvent, disable, or interfere with any safety,
            security, or moderation feature of the App, including the venue
            check-in or location features;
          </li>
          <li>
            Use location or venue check-in information to track, stalk, or
            locate another user without their consent; or
          </li>
          <li>
            Use the App if you are required to register as a sex offender in
            any jurisdiction, or have been convicted of a felony, a sexual
            offense, or a crime involving violence.
          </li>
        </ul>
        <p>
          We reserve the right to investigate and take appropriate action
          against anyone who violates this section, including removing
          content and suspending or terminating accounts.
        </p>
      </LegalSection>

      <LegalSection heading="7. User Content">
        <p>
          You retain ownership of the photos, profile information, and other
          content you submit to the App (&ldquo;User Content&rdquo;). By
          submitting User Content, you grant us a non-exclusive, worldwide,
          royalty-free license to host, store, display, and distribute that
          content as necessary to operate and provide the App, including
          showing your profile to other users. You represent that you own or
          have the necessary rights to the User Content you submit and that
          it does not violate these Terms or any third party&rsquo;s rights.
        </p>
      </LegalSection>

      <LegalSection heading="8. Safety and Your Interactions With Other Users">
        <p>
          The Local does not conduct criminal background checks on users or
          verify the identity, age, or intentions of any user beyond the
          information they provide. You are solely responsible for your
          interactions with other users, both within the App and in person.
          If you decide to meet another user in person, including at a venue
          surfaced through a check-in overlap, we strongly encourage you to
          take reasonable precautions, such as meeting in a public place,
          telling a friend or family member where you are going, and
          arranging your own transportation.
        </p>
        <p>
          You agree that The Local is not responsible for the conduct of any
          user, whether online or in person, and you release us from any
          claims, damages, or liabilities arising from your interactions with
          other users.
        </p>
      </LegalSection>

      <LegalSection heading="9. Termination">
        <p>
          You may delete your account at any time within the App. We may
          suspend or terminate your account or access to the App, with or
          without notice, if we believe you have violated these Terms, posed
          a risk to other users, or for any other reason at our discretion.
          Upon termination, your right to use the App immediately ceases.
        </p>
      </LegalSection>

      <LegalSection heading="10. Disclaimer of Warranties">
        <p>
          THE APP IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER
          EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT THE APP WILL BE
          UNINTERRUPTED, SECURE, OR ERROR-FREE. WE DO NOT WARRANT THE
          ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT OR
          INFORMATION OBTAINED THROUGH THE APP, INCLUDING ANY MATCH, PROFILE,
          OR VENUE CHECK-IN.
        </p>
      </LegalSection>

      <LegalSection heading="11. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAXWELL CHAPIN AND THE
          LOCAL WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR
          GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE APP, EVEN IF WE
          HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL
          AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE
          APP WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US, IF
          ANY, IN THE 12 MONTHS BEFORE THE CLAIM AROSE, OR (B) ONE HUNDRED
          U.S. DOLLARS ($100). SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION
          OR LIMITATION OF CERTAIN DAMAGES, SO SOME OF THE ABOVE LIMITATIONS
          MAY NOT APPLY TO YOU.
        </p>
      </LegalSection>

      <LegalSection heading="12. Indemnification">
        <p>
          You agree to indemnify and hold harmless Maxwell Chapin and The
          Local from any claims, damages, losses, liabilities, and expenses
          (including reasonable attorneys&rsquo; fees) arising out of or
          related to your use of the App, your violation of these Terms, or
          your violation of any rights of a third party.
        </p>
      </LegalSection>

      <LegalSection heading="13. Governing Law and Dispute Resolution">
        <p>
          These Terms are governed by the laws of the Commonwealth of
          Massachusetts, without regard to its conflict-of-laws principles.
          You agree that any dispute arising out of or relating to these
          Terms or the App will be brought exclusively in the state or
          federal courts located in Massachusetts, and you consent to the
          personal jurisdiction of those courts.
        </p>
      </LegalSection>

      <LegalSection heading="14. Changes to These Terms">
        <p>
          We may update these Terms from time to time. If we make material
          changes, we will update the effective date above and, where
          appropriate, notify you through the App or by email. Your continued
          use of the App after a change takes effect constitutes your
          acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="15. Contact Us">
        <p>If you have questions about these Terms, contact:</p>
        <p>
          Maxwell Chapin
          <br />
          The Local
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
