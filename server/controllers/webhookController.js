import Stripe from "stripe";
import { Purchase } from "../models/purchaseModel.js";
import studentModel from "../models/studentModel.js";
import Course from "../models/courseModel.js"; 

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) break;

        const userData = await studentModel.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId); 

        if (!userData || !courseData) break;

        if (!courseData.enrolledStudents.some(id => id.toString() === userData._id.toString())) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        if (!userData.enrolledCourses.some(id => id.toString() === courseData._id.toString())) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("✅ Payment successful:", purchaseId);
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
    console.error("Webhook error:", error.message);
    response.status(500).json({ success: false });
  }
};