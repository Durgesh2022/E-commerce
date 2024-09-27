import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // Authentication check
    const isAuthUser = await AuthUser(req);
    if (!isAuthUser) {
      return NextResponse.json({
        success: false,
        message: "Authentication failed. You are not authorized.",
      });
    }

    // Parsing request body
    let res;
    try {
      res = await req.json();
      console.log("Request body:", res); // Debugging line to log request payload
    } catch (jsonError) {
      return NextResponse.json({
        success: false,
        message: "Invalid JSON data in the request.",
        error: jsonError.message,
      });
    }

    // Ensure res contains valid line_items for Stripe
    if (!res || !Array.isArray(res) || res.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No valid line items provided for the payment.",
      });
    }

    // Validate line_items data
    const validatedLineItems = res.map((item, index) => {
      const { price, quantity, name } = item;
      
      // Log item details for debugging
      console.log(`Item ${index}:`, item);

      // Ensure price, quantity, and name are valid
      if (!price || isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${name || `Item at index ${index}`}`);
      }
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for item: ${name || `Item at index ${index}`}`);
      }
      if (!name) {
        throw new Error(`Item at index ${index} is missing a name.`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: name,
          },
          unit_amount: Math.round(price * 100), // Convert price to cents and round to nearest integer
        },
        quantity: quantity,
      };
    });

    // Creating Stripe session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: validatedLineItems,
        mode: "payment",
        success_url: "http://localhost:3000/checkout?status=success",
        cancel_url: "http://localhost:3000/checkout?status=cancel",
      });

      return NextResponse.json({
        success: true,
        id: session.id,
      });
    } catch (stripeError) {
      console.error("Stripe session creation error:", stripeError);
      return NextResponse.json({
        success: false,
        message: "Stripe session creation failed.",
        error: stripeError.message,
      });
    }

  } catch (generalError) {
    console.error("Error in POST handler:", generalError);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "An internal server error occurred.",
      error: generalError.message,
    });
  }
}
