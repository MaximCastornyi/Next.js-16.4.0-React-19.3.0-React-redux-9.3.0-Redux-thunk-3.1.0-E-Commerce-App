import bcrypt from "bcrypt";
import { validateEmail } from "../../../utils/validation";
import db from "../../../utils/db";
import User from "../../../models/User";
import { createActivationToken } from "../../../utils/tokens";
import { sendEmail } from "../../../utils/sendEmails";
import { activateEmailTemplate } from "../../../emails/activateEmailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await db.connectDb();

    // Гарантируем, что req.body является объектом
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "This email already exists." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: cryptedPassword });
    const addedUser = await newUser.save();

    const activation_token = createActivationToken({
      id: addedUser._id.toString(),
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/activate/${activation_token}`;

    // Отправляем письмо с обработкой возможных ошибок SMTP
    try {
      await sendEmail(
        email,
        url,
        "",
        "Activate your account.",
        activateEmailTemplate
      );
    } catch (emailErr) {
      console.error("Failed to send activation email:", emailErr);
    }

    await db.disconnectDb();

    return res.status(200).json({
      message: "Register success! Please activate your email to start.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: error.message });
  }
}