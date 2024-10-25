import { Op } from "sequelize"; // Import Sequelize operators
import { format, utcToZonedTime } from "date-fns-tz";
import Contact from "../../../models/Contact";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { name, email, timezone, startDate, endDate, sort } = req.query;

    const queryOptions = {
      where: {},
      order: [],
    };

    // Add filtering conditions based on query parameters
    if (name) queryOptions.where.name = name;
    if (email) queryOptions.where.email = email;

    // Add date range filter if provided
    if (startDate && endDate) {
      queryOptions.where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Handle sorting if provided
    if (sort) {
      queryOptions.order.push([sort, "ASC"]);
    }

    try {
      const contacts = await Contact.findAll(queryOptions);

      // Convert timestamps to user's timezone if specified
      const contactsWithTimezone = contacts.map((contact) => {
        const utcCreatedAt = contact.createdAt; // UTC timestamp
        const utcUpdatedAt = contact.updatedAt; // UTC timestamp
        const zonedCreatedAt = utcToZonedTime(utcCreatedAt, timezone || "UTC");
        const zonedUpdatedAt = utcToZonedTime(utcUpdatedAt, timezone || "UTC");

        return {
          ...contact.toJSON(),
          createdAt: format(zonedCreatedAt, "yyyy-MM-dd HH:mm:ssXXX", {
            timeZone: timezone || "UTC",
          }),
          updatedAt: format(zonedUpdatedAt, "yyyy-MM-dd HH:mm:ssXXX", {
            timeZone: timezone || "UTC",
          }),
        };
      });

      return res.status(200).json(contactsWithTimezone);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving contacts." });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
