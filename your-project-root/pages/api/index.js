import bcrypt from "bcryptjs";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, resetCode, newPassword } = req.body;

    const user = await User.findOne({ where: { email, resetCode } });
    if (!user) {
      return res.status(400).json({ message: "Invalid reset code or email." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null; // Clear the reset code
    await user.save();

    return res.status(200).json({ message: "Password updated successfully!" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
