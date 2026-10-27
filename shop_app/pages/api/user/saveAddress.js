import { createRouter } from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter();

router.use(auth);

router.post(async (req, res) => {
  try {
    await db.connectDb();
    
    const { address } = req.body;

    // Находим пользователя, пушим новый адрес и сразу возвращаем актуальный документ с помощью returnDocument: 'after'
    const user = await User.findByIdAndUpdate(
      req.user,
      {
        $push: {
          address: address,
        },
      },
      { returnDocument: 'after' }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ addresses: user.address });
  } catch (error) {
    console.error("Save address error:", error);
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: err.message });
  },
});