import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {

  try {
    const plan_amount: number = 10;
    const amount: number = plan_amount * 100; // amount in paisa. In our case it's INR 1
    const currency = "INR";
    let id = nanoid();
    const options = {
      amount,
      currency,
      receipt: `receipt#${id}`,
    };

    const order = await instance.orders.create(options);
    return NextResponse.json(order);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
