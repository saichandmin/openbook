import { validateContact } from "../../../utils/validators"; // Create a validator function
import Contact from "../../../models/Contact"; // Assuming you have a Contact model

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const contactData = req.body;

      // Validate contact data
      await validateContact(contactData);

      const contact = await Contact.create(contactData);
      return res.status(201).json(contact);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
