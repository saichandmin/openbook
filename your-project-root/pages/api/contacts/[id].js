// pages/api/contacts/[id].js
import Contact from "../../../models/Contact";
import { validateContact } from "../../../utils/validators"; // Import the validation function

export default async function handler(req, res) {
  const { id } = req.query;

  // Update contact
  if (req.method === "PUT") {
    try {
      const contactData = req.body;

      // Validate contact data
      await validateContact(contactData);

      const contact = await Contact.findByPk(id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found." });
      }

      await contact.update(contactData);
      return res.status(200).json(contact);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Soft delete contact
  if (req.method === "DELETE") {
    try {
      const contact = await Contact.findByPk(id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found." });
      }

      contact.isActive = false; // Assuming you have an isActive field
      await contact.save();
      return res.status(200).json({ message: "Contact soft deleted." });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting contact." });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ message: "Method not allowed" });
}
