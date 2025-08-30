"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  const params = useSearchParams();
  const studentId = params.get("studentId");
  const orderId = params.get("orderId");

  const downloadReceipt = () => {
    window.open(`/api/payment/receipt?studentId=${studentId}&orderId=${orderId}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Thank You!</h1>
      <p>Your registration is successful.</p>
      <p><b>Student ID:</b> {studentId}</p>
      <Button onClick={downloadReceipt} className="mt-4">Download Receipt</Button>
    </div>
  );
}
