import Stripe from "stripe";
import { Purchase } from "../models/purchaseModel.js";
import studentModel from "../models/studentModel.js";
import Course from "../models/courseModel.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const handleSuccessfulPayment = async (purchaseId) => {
 

  const purchaseData = await Purchase.findById(purchaseId);


  if (!purchaseData) {
  
    return;
  }

  const userData = await studentModel.findById(purchaseData.userId);

  const courseData = await Course.findById(purchaseData.courseId);
 

  if (!userData || !courseData) {

    return;
  }

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
  
  } catch (err) {
  
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
    

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        if (!sessions.data.length) {
          console.log("❌ No session found for payment intent:", paymentIntent.id);
          break;
        }

        const { purchaseId } = sessions.data[0].metadata;
     

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
      
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
  } catch (error) {

    response.status(500).json({ success: false });
  }
};