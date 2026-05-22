import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — First Step Hoops",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="May 22, 2026">
      <P>
        First Step Hoops LLC (&quot;First Step Hoops,&quot; &quot;we,&quot;
        &quot;us&quot;) provides youth basketball training. This Privacy Policy
        explains what information we collect through our website and booking
        system, how we use it, and the choices you have. By using our site or
        booking a session, you agree to this policy.
      </P>

      <H2>Information we collect</H2>
      <P>When you book a session, we collect:</P>
      <UL>
        <li>
          <strong>Parent or guardian information</strong> — your name, email
          address, and phone number.
        </li>
        <li>
          <strong>Player information</strong> — the child&apos;s name, grade
          level, basketball experience, and any medical notes you choose to
          provide.
        </li>
        <li>
          <strong>Booking details</strong> — the sessions you book, including
          dates, times, and locations.
        </li>
        <li>
          <strong>Waiver records</strong> — when you sign our liability waiver,
          we record your typed name, the date and time, your IP address, and
          basic information about your browser or device.
        </li>
        <li>
          <strong>Payment information</strong> — payments are processed by
          Stripe. We do not collect or store your card number; Stripe handles
          that. We retain a payment reference and the amount paid.
        </li>
      </UL>
      <P>
        We collect this information directly from you when you complete the
        booking form. We do not knowingly collect information directly from
        children.
      </P>

      <H2>How we use your information</H2>
      <UL>
        <li>To schedule, deliver, and manage training sessions.</li>
        <li>
          To communicate with you about bookings, confirmations, cancellations,
          and questions.
        </li>
        <li>To process payments and issue refunds.</li>
        <li>
          To keep your child safe during sessions, including being aware of any
          medical information you have shared.
        </li>
        <li>To maintain records of signed waivers.</li>
        <li>To operate, maintain, and improve our service.</li>
      </UL>

      <H2>Medical information</H2>
      <P>
        Medical notes you provide are used only so our coach is aware of
        conditions that could affect your child&apos;s participation or safety.
        We are not a healthcare provider, and this information is not subject to
        HIPAA. Please share only what is relevant to safe participation.
      </P>

      <H2>How we share information</H2>
      <P>
        We do not sell your personal information. We share it only with the
        service providers that help us operate, and only as needed to run our
        business:
      </P>
      <UL>
        <li>
          <strong>Stripe</strong> — payment processing.
        </li>
        <li>
          <strong>Resend</strong> — sending booking confirmation and
          notification emails.
        </li>
        <li>
          <strong>Neon and Vercel</strong> — database and website hosting.
        </li>
      </UL>
      <P>
        We may also disclose information if required by law or where necessary
        to protect the safety of a participant.
      </P>

      <H2>Data security</H2>
      <P>
        Information is stored in a managed database, with access restricted to
        authorized First Step Hoops personnel through a password-protected admin
        system. No method of storage or transmission is completely secure, but
        we take reasonable steps to protect your information.
      </P>

      <H2>Data retention</H2>
      <P>
        We keep booking, waiver, and related records for as long as needed to
        operate our business, meet legal and tax obligations, and resolve any
        disputes. You may request deletion of your information, as described
        below.
      </P>

      <H2>Cookies</H2>
      <P>
        Our website uses a small number of cookies that are necessary for it to
        function — for example, to keep an administrator signed in and to
        support secure payment through Stripe. We do not use advertising
        cookies.
      </P>

      <H2>Children&apos;s privacy</H2>
      <P>
        Our website and booking system are intended for use by parents and
        guardians, not by children. Information about a child is provided to us
        by their parent or guardian. If you believe a child has provided us
        information directly, please contact us and we will delete it.
      </P>

      <H2>Your choices</H2>
      <P>
        You may request access to, correction of, or deletion of the personal
        information we hold about you and your child by emailing us at{" "}
        <a
          href="mailto:tpelligrino@firststep-hoops.com"
          className="text-blue underline"
        >
          tpelligrino@firststep-hoops.com
        </a>
        . We will respond within a reasonable time. Some information may be
        retained where we are required by law to keep it.
      </P>

      <H2>Changes to this policy</H2>
      <P>
        We may update this Privacy Policy from time to time. The &quot;Last
        updated&quot; date above reflects the most recent version.
      </P>

      <H2>Contact us</H2>
      <P>
        Questions about this policy or your information:{" "}
        <a
          href="mailto:tpelligrino@firststep-hoops.com"
          className="text-blue underline"
        >
          tpelligrino@firststep-hoops.com
        </a>
        .
      </P>
    </LegalPage>
  );
}
