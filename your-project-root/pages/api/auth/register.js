import limiter from "../../../middleware/rateLimit"; // Adjust the path as necessary
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import { validateUser } from "../../../utils/validators";
import { sendVerificationEmail } from "../../../utils/email"; // Adjust the path as necessary

export default async function handler(req, res) {
  limiter(req, res, async () => {
    if (req.method === "POST") {
      try {
        const userData = req.body;

        // Validate input
        await validateUser(userData);

        const { email, password } = userData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // Create the user in the database
        const user = await User.create({
          email,
          password: hashedPassword,
          verificationToken,
          isVerified: false,
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return res.status(201).json({
          message:
            "User registered successfully! Check your email for verification.",
        });
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          return res.status(400).json({ message: "Email already exists." });
        }
        return res.status(400).json({ message: error.message });
      }
    }

    return res.status(405).json({ message: "Method not allowed" });
  });
}
