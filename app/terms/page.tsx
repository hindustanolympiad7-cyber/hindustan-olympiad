import React from 'react';
import { Poppins, Inter } from "next/font/google";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
});

const red = "#B2252A";
const black = "#000000";
const bg = "#FEF3E6"; // updated to match Panel 9

const TermsAndConditionsPage = () => {
return (
	<div className="max-w-7xl mx-auto flex flex-col items-left pt-12">
		<div className="mb-6">
			<Link href="/">
			<Button variant="outline" className="mb-4">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back
			</Button>
			</Link>
		</div>
					<h2
						className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold mb-10"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						Terms & Condtions
					</h2>

					<ul>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							1. These Terms &amp; Conditions are the complete and exclusive statements of the
							understanding between Hindustan Media Ventures Limited (HMVL) &amp; Participant
							(through Authorized Representative/ Guardians; as the case may be) and shall
							apply to the ‘Hindustan Olympiad’, (Contest) a contest for all students falling
							within the territories of Uttar Pradesh, Uttarakhand, Bihar and Jharkhand to be
							held by HMVL. It supersedes all the understanding or other prior understanding,
							whether oral &amp; written, and all representation or other communications between
							HMVL &amp; the Participants in the Contest amounts to acceptance of these terms &amp;
							conditions.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							2. The Contest is open to all the students from 1st Grade to 12th Grade falling
							within the territories of Uttar Pradesh, Uttarakhand, Bihar and Jharkhand. The
							contest will take place between 1st July 2025 to 28th Feb 2026.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							3. There will be a single test for all the 5 subjects for each class. For classes XI &amp;
							XII, these subjects will depend on the stream selected by the student at the time
							of registration.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							4. The questions in the test shall be prepared by &amp; large from the syllabus of the
CBSE board of the student’s respective Grade.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							5. Students can register for the contest ONLY through their school.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							6. Last date for registration in Hindustan Olympiad is 31st October 2025.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							7. Test for Hindustan Olympiad will be conducted between 5th Dec and 20th Dec in
respective schools of the participating students.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							8. The test will be conducted using OMR sheets and the questions will be in both
English as well as Hindi.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							9. Results of the Contest shall be declared by HMVL on or before 28th Feb 2026 on
the website <a href="https://www.hindustanolympiad.in/" target="_blank">https://www.hindustanolympiad.in/</a>  communicated via Print and digital
Ads.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							10. Participation in the Contest is purely voluntary and applicants can participate by
completing the registration process through their school.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							11. Registration fee (non-refundable) is Rs.250 inclusive of all taxes.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							12. All entries received from Participants shall have the consent of their Guardian/ Parent (as the case may be) in the manner laid down in the Registration forms.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							13. HMVL shall not be responsible for any loss or damage suffered by the Participants while participating in the Contest and any failure by HMVL to enforce any of these Rules in any instance(s) shall not give rise to any claim by any person. Further, HMVL shall not be responsible in any way for failure/delays of any backend technology and the resultant inability of a Participant to send in his/her/their entry or register/participate in the Contest.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							14. Only correct entries received by HMVL during the Contest period shall be considered eligible for the registration/Contest participation and HMVL shall not be responsible for non-receipt of any entry. HMVL does not take any responsibility for any errors arising out of incorrect or incomplete entries. Only those Participants with the correct entry (as determined by HMVL) shall be eligible to participate in the Contest.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							15.  Entries rejected by HMVL shall be returned to the respective Participants. For the Participants, on intimation of rejection, the refund for the Registration Fee shall be processed within 07 business days to the source of payment.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							16. HMVL reserves the right to disqualify Participants for misrepresenting their school/class details.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							17. HMVL reserves the right to disqualify Participants for misrepresenting their school/class details.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							18. Payments: The Contest is a paid service. All payments shall be through the payment mechanism put in place by HMVL. Participants shall submit the registration fee through the medium communicated to them by their respective school. HMVL shall not be liable for any unauthorized use, fraud, payment refunds, lost amount etc. in the transaction.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							19. Communication: Participants (through their Parent/Guardian) hereby explicitly consent to receive communication from HMVL or its representative by email, telephone, WhatsApp or SMS/text message for the purposes of providing alerts and information about the contest and our services.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							20. The decision of HMVL with respect to the selection of winners shall be final and binding upon the Participants. There shall be no revaluation or revision of the results declared by HMVL.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							21. In case 2 or more students have common score at an overall level, student with higher marks in Section A will get higher rank. In case 2 or more students have same marks at an overall level as well as in Section A, student with higher marks in Section B will get higher rank. Same process will be followed until we get a unique rank for all the students. In case 2 or more students share same marks at an overall level as well as in each of the 5 sections, younger student (by DOB) will get higher rank.
							</p>
						</li>
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							22. Every participant will be eligible for only 1 prize i.e. National level topper will not be eligible for state or district level prizes despite being among top 3 rank holders at these levels.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							23. Though HMVL shall make every effort to declare the results of the Contest on the due date, it shall not be responsible for any delay, arising out of reasons beyond its control.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							24. All entries will be treated as the property of HMVL and can be used by HMVL for any promotional and/or commercial activity & the Participants/toppers waive all rights of whatsoever nature in the said entries in favor of HMVL by participating in the Contest.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							25. HMVL in its absolute discretion may publicize, broadcast or otherwise disclose a Participant’s/topper’s name, particulars, likeness, statements or any recording of their voice in advertising or promotional activities concerning this Contest, or generally. HMVL may promote or advertise that a topper has won the Contest. HMVL may also require Participants/toppers to participate in a photo, video and/or film session and acknowledge that HMVL has the absolute and exclusive right to use such publicity photos, videos and/or films in any medium and in any reasonable manner it may deem fit without any consideration or payment of similar nature to such Participants/toppers.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							26. Winners must collect the Prize within 14 days from the date of announcement or Felicitation ceremony or such other date as may be decided by HMVL. The venue for the collection of prizes will be informed by HMVL through notification.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							27. For the district and state level prizes (for each class), the minimum participation required at the district/state level (for each class) should be 1000 and 5000 students respectively.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							28. The winner is solely responsible for any other expenses, loss or damages related to the acceptance/use of the offer or participation in the Contest. Any levies, duties, incidental charges and taxes wherever applicable, shall be borne by the person participating in the Contest. The winner may submit the proof of depositing the tax due on the prize (on the value of Prize) (i.e. challan of depositing the tax) at the time of claiming the prize. Alternatively, HMVL will be deducting taxes at source as applicable from time to time on the prize (on the value of the prize), therefore, the Participant/winner claiming the prize must furnish his/her PAN number while claiming the prize and in absence of PAN number, HMVL will not issue any TDS certificate to the winner. In case the Participant/winner does not have a PAN number or fails to provide the PAN details of his/her parent/guardian, then HMVL shall have the discretion to disqualify the Participant/topper from the Contest.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							29. HMVL reserves the right to extend the dates of the Contest or to cancel, or change how the Contest is organized or discontinue or terminate the Contest at any time or to accept or reject any or all entries at their absolute discretion without giving any prior notice and without assigning any reason whatsoever.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							30. The prize(s) shall not be transferable or substituted for cash or clubbed with any other prize/offer and no such request shall be entertained by HMVL.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							31. In the event of any winner choosing not to accept a prize(s) or forfeit any and/or all claims qua the prize or if HMVL is unable to reach/contact the winner at the contact details from which entries were sent for the Contest HMVL shall have the absolute discretion to deal with such prize as it deems fit.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							32. HMVL shall not be responsible for any defects/inadequacy/deficiency in the prizes. HMVL would not be liable to replace/exchange the prizes at any point in time.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							33. Any attempt by a Participant to deliberately damage or undermine the legitimate operation of the Contest is a violation of Criminal and Civil Laws and should such an attempt be made, HMVL reserves the right to seek damages from any such Participant to the fullest extent permitted by law.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							34. HMVL reserves the right to share and/or sell the information collected from the Participants at mutually agreed terms & conditions with external parties.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							35. The Contest shall be governed by and construed in accordance with the laws of India. Any disputes, differences and, or, any other matters in relation to and arising out of the Contest and, or, pertaining to the rules and regulations and, or, the Terms and Conditions shall be referred to arbitration under the Arbitration & Conciliation Act, 1996. The arbitral tribunal shall consist of a sole arbitrator to be appointed by HMVL. The venue of arbitration shall be New Delhi.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							36. Any decision taken by HMVL will be final and binding to all the participants.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							37. All disputes shall be subject to the exclusive jurisdiction of the Courts of New Delhi only.
							</p>
						</li>						
						<li>
							<p className=" text-md mb-4 font-inter" style={{ color: black, fontFamily: "Inter, sans-serif" }}>
							38. HMVL holds the right to change, replace or cancel any prize without any prior intimation. Also, HMVL can replace any cash prize with gift of equal value or can convert any gift to a cash prize at its sole discretion without any prior intimation.
							</p>
						</li>
					</ul>
</div>
);
};

export default TermsAndConditionsPage;
