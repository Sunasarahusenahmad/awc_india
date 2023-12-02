import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      for (let index = 0; index < files.gallery_images.length; index++) {
        const image = files.gallery_images[index];
        const imageDetails = {
          gallery_title: fields[`gallery_title_${index}`] || "",
          gallery_sort: fields[`gallery_sort_${index}`] || "",
          file: image.originalFilename,
        };

        // Extract category IDs from fields
        const categoryIds = [];
        for (let categoryIndex = 0; ; categoryIndex++) {
          const key = `gallery_categories_${index}_${categoryIndex}`;
          if (!fields[key]) break;
          categoryIds.push(fields[key]);
        }

        // File saving
        const oldPath = image.filepath;
        const newFileName = `${Date.now()}_${image.originalFilename}`;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/gallery"
        );
        const newPath = path.join(projectDirectory, newFileName);

        fs.copyFile(oldPath, newPath, async (moveErr) => {
          if (moveErr) {
            console.log(moveErr);
            res.status(500).json({ message: "File Upload failed." });
          } else {
            // Database insertion for each category ID
            for (const categoryId of categoryIds) {
              const sql =
                "INSERT INTO gallery (gallery_title, gallery_image, gallery_sort, gallery_category_id) VALUES (?, ?, ?, ?)";
              const values = [
                imageDetails.gallery_title,
                newFileName,
                imageDetails.gallery_sort,
                categoryId,
              ];
              await conn.query(sql, values);
            }

            res.status(200).json({ message: "File Upload successful." });
          }
        });
      }
    });
  }

  if (req.method == "GET") {
    try {
      // Query the database
      const getGalleryData = "SELECT * FROM `gallery`";

      const [rows] = await conn.query(getGalleryData);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
