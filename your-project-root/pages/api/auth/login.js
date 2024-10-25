import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isVerified) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or email not verified." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
