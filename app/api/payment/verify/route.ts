import crypto from "crypto";
import { useState } from "react";
import { NextResponse } from "next/server";
import { IndiviualStudent } from "@/utils/models/indiviualStudents";
import { useToast } from "@/hooks/use-toast";

export async function POST(req: Request) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ...studentData } = body;

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (sign !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Save student with payment info
  const student = await IndiviualStudent.create({
    ...studentData,
    studentId: `STU${Date.now()}`,
    paymentStatus: "paid",
    orderId: razorpay_order_id,
    transactionId: razorpay_payment_id,
  });
	const [isSubmitting, setIsSubmitting] = useState(false);
	// ...existing code...
	interface StudentFormData {
		name: string;
		class: string;
		section: string;
		gender: string;
		stream: string;
		parentName: string;
		parentContact: string;
		schoolName: string;
		schoolBranch: string;
		schoolAddress: string;
		district: string;
	}
	const [region, setRegion] = useState("");
	const [studentForm, setStudentForm] = useState<StudentFormData>({
			name: "",
			class: "",
			section: "",
			gender: "",
			stream: "",
			parentName: "",
			parentContact: "",
			schoolName: "",
			schoolBranch: "",
			schoolAddress: "",
			district: "",
		});
  // TODO: Send SMS here
	const { success, error } = useToast();
  try {
		const res = await fetch("/api/eoi/student", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...studentForm, region }),
		});
		if (res.ok) {
			success("Registration successful!", { position: "top-right", duration: 2000 });
			const data = await res.json();
			const studentId = data.student.studentId;
			const { parentContact } = studentForm;
			setStudentForm({
				name: "",
				class: "",
				section: "",
				gender: "",
				stream: "",
				parentName: "",
				parentContact: "",
				schoolName: "",
				schoolBranch: "",
				schoolAddress: "",
				district: "",
			});
				await fetch("/api/eoi/student/parent-sms", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						phoneNumber: parentContact,   // 👈 parent ka number
						studentId: studentId // 👈 register ke baad jo ID generate hui
					}),
				});
			setRegion("");
		} else {
			const data = await res.json();
			throw new Error(data.error || "Submission failed");
		}
	} catch (err: any) {
		error("Something went wrong!", { duration: 3000, description: err.message });
	} finally {
		setIsSubmitting(false);
	}

  return NextResponse.json({ studentId: student.studentId, orderId: razorpay_order_id });
}
