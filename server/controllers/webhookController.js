import Stripe from "stripe";
import { Purchase } from "../models/purchaseModel.js";
import studentModel from "../models/studentModel.js";
import Course from "../models/courseModel.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const handleSuccessfulPayment = async (purchaseId) => {
  console.log("🔍 Looking for purchaseId:", purchaseId);

  const purchaseData = await Purchase.findById(purchaseId);
  console.log("🧾 Purchase found:", purchaseData);

  if (!purchaseData) {
    console.log("❌ No purchase found for id:", purchaseId);
    return;
  }

  const userData = await studentModel.findById(purchaseData.userId);
  console.log("👤 User found:", userData?._id);

  const courseData = await Course.findById(purchaseData.courseId);
  console.log("📚 Course found:", courseData?._id);

  if (!userData || !courseData) {
    console.log("❌ User or Course not found");
    return;
  }

  if (!courseData.enrolledStudents.some(id => id.toString() === userData._id.toString())) {
    courseData.enrolledStudents.push(userData._id);
    await courseData.save();
    console.log("✅ Student added to course");
  }

  if (!userData.enrolledCourses.some(id => id.toString() === courseData._id.toString())) {
    userData.enrolledCourses.push(courseData._id);
    await userData.save();
    console.log("✅ Course added to student");
  }

  purchaseData.status = "completed";
  await purchaseData.save();
  console.log("✅ Purchase status updated to completed:", purchaseId);
};

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook verified, event type:", event.type);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("💳 payment_intent.succeeded:", paymentIntent.id);

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        if (!sessions.data.length) {
          console.log("❌ No session found for payment intent:", paymentIntent.id);
          break;
        }

        const { purchaseId } = sessions.data[0].metadata;
        console.log("📦 Session metadata purchaseId:", purchaseId);

        await handleSuccessfulPayment(purchaseId);
        break;
      }

      
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("📦 Session metadata:", session.metadata);

        const { purchaseId } = session.metadata;
        await handleSuccessfulPayment(purchaseId);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) break;

        purchaseData.status = "failed";
        await purchaseData.save();
        console.log("❌ Session expired:", purchaseId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler error:", error.message);
    console.error(error.stack);
    response.status(500).json({ success: false });
  }
};