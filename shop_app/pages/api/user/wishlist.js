import { createRouter } from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter();

router.use(auth);

router.put(async (req, res) => {
  try {
    db.connectDb();
    const { product_id, style } = req.body;
    const user = await User.findById(req.user);
    
    if (!user) {
      db.disconnectDb();
      return res.status(404).json({ message: "User not found" });
    }

    const exist = user.wishlist.find(
      (x) => x.product == product_id && x.style == style
    );
    
    if (exist) {
      db.disconnectDb();
      return res
        .status(400)
        .json({ message: "Product already exists in your wishlist." });
    }

    await user.updateOne({
      $push: {
        wishlist: {
          product: product_id,
          style,
        },
      },
    });

    db.disconnectDb();
    return res
      .status(200)
      .json({ message: "Product succesfully added to your wishlist." });
  } catch (error) {
    db.disconnectDb();
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: err.message });
  },
});