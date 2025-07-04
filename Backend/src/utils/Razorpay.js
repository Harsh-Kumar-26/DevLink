// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Project from "../models/project.model.js"; // Adjust path if needed
// import axios from "axios";
// import User from "../models/user.model.js";
// import ApiError from "../utils/apierror.js"

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Create Razorpay order
// export const createOrder = async (req, res) => {
//   const { amount } = req.body;

//   const options = {
//     amount: amount * 100,
//     currency: "INR",
//     receipt: `receipt_${Date.now()}`,
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (err) {
//     console.error("Razorpay Order Error:", err);
//     res.status(500).json({ message: "Failed to create Razorpay order" });
//   }
// };

// //Verify Razorpay payment
// export const verifyPayment = async (req, res) => {
//   const { response, projectId } = req.body;

//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

//   const generated_signature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest("hex");
//      if (generated_signature !== razorpay_signature) {
//     return res.status(400).json({ message: "Invalid payment signature" });
//   }
  
//   try {
//    const project = await Project.findById(projectId).populate("accept", "_id fullname razorpayAccountId");
// //    const developerId=project.accept._id;
//     const developer = project.accept;

//     if (!project || !developer) {
//       throw new ApiError(404, "Project or Developer not found");
//     }

//     if (!developer.razorpayAccountId) {
//       throw new ApiError(400, "Developer is not connected to Razorpay");
//     }
//     const amountInPaise = project.money * 100;
//     // const platformCut = Math.floor(amountInPaise * 0.05); // 5%
//     // const devAmount = amountInPaise;

//     let payoutSuccess = true;

    
//     try {
//       await razorpay.payments.transfer(razorpay_payment_id, {
//         transfers: [
//           {
//             account: developer.razorpayAccountId,
//             amount: amountInPaise,
//             currency: "INR",
//             notes: {
//               projectId,
//               developerId:developer._id,
//             },
//           },
//         ],
//       });
//     } catch (err) {
//       payoutSuccess = false;
//       console.error("Transfer failed:", err?.response?.data || err);
//     }




//   // ✅ Update DB on successful payment
//     await Project.findByIdAndUpdate(projectId, {
//       paid: payoutSuccess
//     });

//     res.status(200).json({ message: "Payment verified successfully" });
//   } catch (err) {
//     console.error("DB Update Error:", err);
//     res.status(500).json({ message: "Payment verified but failed to update project" });
//   }
// };
