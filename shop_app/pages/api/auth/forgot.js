import db from "../../../utils/db";
import User from "../../../models/User";
import { createResetToken } from "../../../utils/tokens";
import { sendEmail } from "../../../utils/sendEmails";
import { resetEmailTemplate } from "../../../emails/resetEmailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await db.connectDb();
    const { email } = req.body;

    // 1. Проверяем наличие пользователя
    const user = await User.findOne({ email });
    if (!user) {
      await db.disconnectDb();
      return res.status(400).json({ message: "This email does not exist." });
    }

    // 2. Генерируем токен и ссылку
    const user_id = createResetToken({
      id: user._id.toString(),
    });
    const url = `${process.env.BASE_URL}/auth/reset/${user_id}`;

    // 3. Обязательно ждем завершения отправки письма (await!)
    await sendEmail(
      email,
      url,
      "",
      "Reset your password.",
      resetEmailTemplate
    );

    // 4. Отключаемся от БД только после отправки письма
    await db.disconnectDb();

    return res.json({
      message: "An email has been sent to you, use it to reset your password.",
    });
  } catch (error) {
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
}