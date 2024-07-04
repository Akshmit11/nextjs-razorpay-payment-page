"use client";

import { initializeRazorpay } from "@/constants";
import { subscribePlan } from "@/lib/actions/plan.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SubscriptionPlan = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    const res = await initializeRazorpay();
    if (!res) {
      alert("Razorpay SDK Failed to load");
      setIsLoading(false);
      return;
    }

    const response = await subscribePlan();
    const options = {
      key: response.key,
      name: "Testing Payments",
      description: "Testing RazorPay Integration",
      currency: response.order.currency,
      amount: response.order.amount,
      order_id: response.order.id,
      
      handler: async function (r: any) {
        console.log(r);
        try {
          const handleData = await fetch(
            "http://localhost:3000/api/paymentverify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                razorpay_payment_id: r.razorpay_payment_id,
                razorpay_order_id: r.razorpay_order_id,
                razorpay_signature: r.razorpay_signature,
              }),
            }
          );
          if (!handleData.ok) {
            throw new Error(
              `Server error in handler function sending response: ${handleData.statusText}`
            );
          }

          const handleResponse = await handleData.json();
          if (handleResponse?.message === "success") {
            router.push("http://localhost:3000/working");
          } else {
            router.push("http://localhost:3000/not-working");
          }
        } catch (error) {
          console.log("handle response ", error);
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
          console.log("Payment modal closed");
        },
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response: any) {
      console.log(
        "Payment failed. Please try again. Contact support for help ",
        response
      );
    });
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-black text-white rounded-md text-center"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay"}
      </button>
    </div>
  );
};

export default SubscriptionPlan;
