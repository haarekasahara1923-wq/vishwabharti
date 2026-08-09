import { db } from "../src/db/index.js";
import { announcements, contactInfo, siteSettings, aboutContent, galleryItems } from "../src/db/schema.js";

async function testOperations() {
  console.log("--- Testing Announcements ---");
  try {
    const ann = await db.insert(announcements).values({ text: "Test Announcement", isActive: true }).returning();
    console.log("Inserted announcement:", ann);
  } catch (err) {
    console.error("Announcement insert error:", err);
  }

  console.log("--- Testing Contact Info ---");
  try {
    const existing = await db.select().from(contactInfo).limit(1);
    console.log("Existing contact info:", existing);
  } catch (err) {
    console.error("Contact info select error:", err);
  }

  console.log("--- Testing Site Settings ---");
  try {
    const settings = await db.select().from(siteSettings);
    console.log("Site settings:", settings);
  } catch (err) {
    console.error("Site settings select error:", err);
  }
}

testOperations();
