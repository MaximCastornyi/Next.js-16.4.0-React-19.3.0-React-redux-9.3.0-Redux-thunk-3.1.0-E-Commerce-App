import db from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await db.connectDb();
    const { user_id, password } = req.body;

    // 1. Находим пользователя по ID из токена
    const user = await User.findById(user_id);
    if (!user) {
      await db.disconnectDb();
      return res.status(400).json({ message: "This account does not exist." });
    }

    // 2. Хешируем новый пароль
    const cryptedPassword = await bcrypt.hash(password, 12);

    // 3. Обновляем пароль пользователя
    await user.updateOne({
      password: cryptedPassword,
    });

    await db.disconnectDb();

    // 4. Возвращаем email, чтобы фронтенд мог автоматически авторизовать пользователя через signIn
    return res.json({ email: user.email });
  } catch (error) {
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
}