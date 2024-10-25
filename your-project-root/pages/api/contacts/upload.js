import multer from "multer";
import { parse } from "csv-parser";
import xlsx from "xlsx";
import fs from "fs";
import { processContacts } from "../../../utils/contactService"; // Import processing function
import Contact from "../../../models/Contact";

const upload = multer({ dest: "uploads/" }); // Specify upload directory

// Handle CSV and Excel file uploads
export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(500).json({ message: "File upload error." });

      const contacts = [];
      const fileType = req.file.mimetype;

      try {
        if (fileType === "text/csv") {
          // Process CSV file
          fs.createReadStream(req.file.path)
            .pipe(parse())
            .on("data", (row) => {
              contacts.push(row);
            })
            .on("end", async () => {
              await processContacts(contacts);
              res
                .status(200)
                .json({ message: "Contacts uploaded successfully." });
            });
        } else if (
          fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          // Process Excel file
          const workbook = xlsx.readFile(req.file.path);
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = xlsx.utils.sheet_to_json(sheet);
          await processContacts(jsonData);
          res.status(200).json({ message: "Contacts uploaded successfully." });
        } else {
          return res.status(400).json({ message: "Invalid file type." });
        }
      } catch (error) {
        return res.status(500).json({ message: "Error processing file." });
      } finally {
        // Clean up: Remove the uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

// Function to validate and save contacts
async function processContacts(contacts) {
  for (const contact of contacts) {
    // Validate contact data here (ensure fields are present and valid)
    // Example: Check if email is unique, validate required fields, etc.
    await Contact.create(contact);
  }
}
