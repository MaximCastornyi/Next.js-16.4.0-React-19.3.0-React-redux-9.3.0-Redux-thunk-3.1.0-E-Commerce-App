import { createRouter } from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter();

// Middleware аутентификации для всех роутов в этом файле
router.use(auth);

router.put(async (req, res) => {
  try {
    db.connectDb();
    const { id } = req.body;
    let user = await User.findById(req.user);
    let user_addresses = user.address;
    let addresses = [];
    
    for (let i = 0; i < user_addresses.length; i++) {
      let temp_address = {};
      if (user_addresses[i]._id == id) {
        temp_address = { ...user_addresses[i].toObject(), active: true };
        addresses.push(temp_address);
      } else {
        temp_address = { ...user_addresses[i].toObject(), active: false };
        addresses.push(temp_address);
      }
    }

    await user.updateOne(
      {
        address: addresses,
      },
      { new: true }
    );
    
    db.disconnectDb();
    return res.json({ addresses });
  } catch (error) {
    db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
});

router.delete(async (req, res) => {
  try {
    db.connectDb();
    const { id } = req.body;
    const user = await User.findById(req.user);
    
    await user.updateOne(
      {
        $pull: { address: { _id: id } },
      },
      { new: true }
    );
    
    db.disconnectDb();
    return res.json({ addresses: user.address.filter((a) => a._id != id) });
  } catch (error) {
    db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: err.message });
  },
});