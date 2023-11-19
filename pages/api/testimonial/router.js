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
    try {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        // check file exist or not
        if (!files.testimonial_image) {
          return res.status(400).json({ message: "Please Upload Files." });
        }

        // configuration of path and name
        const oldPathimage = files.testimonial_image[0].filepath; // Access the path of the uploaded image

        // new path
        const nFileNameimage = `${Date.now()}.${
          files.testimonial_image[0].originalFilename
        }`;

        // remove space
        const newFileNameimage = nFileNameimage.replace(/\s/g, "");

        // project dir
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/testimonial"
        );
        // combine path and image name
        const newPathimage = path.join(projectDirectory, newFileNameimage);

        fs.copyFile(oldPathimage, newPathimage, async (moveErr1) => {
          if (moveErr1) {
            res.status(500).json({ message: "File Upload failed." });
          } else {
            const {
              testimonial_title,
              testimonial_desc,
              testimonial_image,
              testimonial_video,
              testimonial_rating,
            } = fields;

            const sql =
              "INSERT INTO `testimonial`(`testimonial_title`, `testimonial_desc`, `testimonial_image`, `testimonial_video`, `rating`) VALUES (?, ?, ?, ?, ?)";
            const values = [
              testimonial_title,
              testimonial_desc,
              newFileNameimage,
              testimonial_video,
              testimonial_rating,
              1,
            ];
            const [result] = await conn.query(sql, values);
            res.status(200).json(result);
          }
        });
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Testimonial Failed to Add... Check connection" });
    }
  }

  if (req.method == "GET") {
    try {
      // Query the database

      const q = "SELECT * FROM `testimonial`";

      const [rows] = await conn.query(q);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
