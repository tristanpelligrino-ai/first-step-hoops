import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — First Step Hoops",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="May 22, 2026">
      <P>
        These Terms of Service (&quot;Terms&quot;) govern your use of the First
        Step Hoops website and your booking of training sessions with First Step
        Hoops LLC (&quot;First Step Hoops,&quot; &quot;we,&quot; &quot;us&quot;).
        By booking a session or using our site, you agree to these Terms. Please
        read them together with our Privacy Policy and the liability waiver
        presented during booking.
      </P>

      <H2>Our service</H2>
      <P>
        First Step Hoops provides youth basketball training sessions for young
        players. Sessions are led by First Step Hoops staff at the location
        listed for each session.
      </P>

      <H2>Booking and payment</H2>
      <UL>
        <li>
          A session is reserved once payment is completed. Sessions are offered
          at the price shown at checkout.
        </li>
        <li>
          Payments are processed securely by Stripe. By booking, you authorize
          the charge shown at checkout.
        </li>
        <li>
          You must be at least 18 years old and the parent or legal guardian of
          the player in order to book a session.
        </li>
      </UL>

      <H2>Cancellations and rescheduling</H2>
      <UL>
        <li>
          To cancel or reschedule a session, email us at{" "}
          <a
            href="mailto:tpelligrino@firststep-hoops.com"
            className="text-blue underline"
          >
            tpelligrino@firststep-hoops.com
          </a>{" "}
          at least 48 hours before the session&apos;s start time.
        </li>
        <li>
          With at least 48 hours&apos; notice, we will reschedule the session
          or, if you prefer to cancel, issue a refund.
        </li>
        <li>
          Sessions cancelled with less than 48 hours&apos; notice, and missed
          sessions (&quot;no-shows&quot;), are not refundable.
        </li>
        <li>
          If First Step Hoops cancels a session — for weather, facility, or
          other reasons — you will be offered a reschedule or a full refund.
        </li>
      </UL>

      <H2>Liability waiver and assumption of risk</H2>
      <P>
        Basketball training is a physical activity that carries a risk of
        injury. Before a player may participate, the parent or guardian must
        read and sign our liability waiver during booking. By booking, you
        acknowledge these risks and agree to the terms of that waiver.
      </P>

      <H2>Health and safety</H2>
      <UL>
        <li>
          You are responsible for disclosing any medical conditions, allergies,
          or injuries relevant to your child&apos;s safe participation, using
          the medical notes field during booking.
        </li>
        <li>
          First Step Hoops staff are not medical professionals. In an emergency,
          we will seek appropriate medical assistance and attempt to contact
          you.
        </li>
        <li>
          Players should arrive a few minutes early and bring appropriate
          footwear, water, and a basketball.
        </li>
      </UL>

      <H2>Photos and media</H2>
      <P>
        From time to time we may take photos or video during sessions. The
        booking waiver includes a media-release choice; you may decline the use
        of your child&apos;s image in our marketing materials there, or email us
        at any time to opt out.
      </P>

      <H2>Conduct</H2>
      <P>
        We expect players and families to treat coaches, other participants, and
        facilities with respect. We may decline service or end a session if
        conduct is unsafe or disruptive; any refund in those circumstances is at
        our discretion.
      </P>

      <H2>Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, First Step Hoops LLC and its
        owners, coaches, and representatives will not be liable for indirect,
        incidental, or consequential damages arising from your use of our
        service. Nothing in these Terms limits any liability that cannot be
        limited under applicable law. This section is in addition to, and does
        not replace, the signed liability waiver.
      </P>

      <H2>Changes to these Terms</H2>
      <P>
        We may update these Terms from time to time. The &quot;Last
        updated&quot; date above reflects the most recent version. Continuing to
        use our service after a change means you accept the updated Terms.
      </P>

      <H2>Governing law</H2>
      <P>
        These Terms are governed by the laws of the Commonwealth of Virginia,
        without regard to its conflict-of-laws rules.
      </P>

      <H2>Contact us</H2>
      <P>
        Questions about these Terms:{" "}
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
