"use server";

export async function subscribePlan() {
  try {
    const response = await fetch("http://localhost:3000/api/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const order = await response.json();
    const key = process.env.RAZORPAY_KEY_ID;

    return JSON.parse(JSON.stringify({ order, key }));
  } catch (error) {
    console.log(error);
  }
}
