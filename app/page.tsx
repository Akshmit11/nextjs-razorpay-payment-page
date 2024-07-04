import SubscriptionPlan from "@/components/shared/SubscriptionPlan";

export default function Home() {

  const user = {
    _id: "123"
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <SubscriptionPlan userId={user._id} />
    </div>
  );
}
