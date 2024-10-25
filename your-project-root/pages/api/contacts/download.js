import { Parser } from "json2csv";
import Contact from "../../../models/Contact";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const contacts = await Contact.findAll();
      const jsonContacts = contacts.map((contact) => contact.toJSON());

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(jsonContacts);

      res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
      res.setHeader("Content-Type", "text/csv");
      res.status(200).send(csv);
    } catch (error) {
      return res.status(500).json({ message: "Error generating CSV." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
