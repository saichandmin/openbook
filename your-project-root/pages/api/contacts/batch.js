import { validateContact } from "../../../utils/validators"; // Your validation function
import Contact from "../../../models/Contact";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const contactsData = req.body; // Expecting an array of contacts

      for (const contactData of contactsData) {
        await validateContact(contactData); // Validate each contact
        const existingContact = await Contact.findOne({
          where: { email: contactData.email },
        });

        if (existingContact) {
          await existingContact.update(contactData); // Update if exists
        } else {
          await Contact.create(contactData); // Create if new
        }
      }

      return res.status(200).json({ message: "Batch processed successfully." });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
