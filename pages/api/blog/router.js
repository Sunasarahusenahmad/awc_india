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
    form.parse(req, (err, fields, files) => {
      const {
        cate_id,
        product_title,
        product_short_desc,
        product_long_desc,
        meta_tag,
        meta_desc,
        meta_keyword,
        canonical_url,
      } = fields;

      // check file exist or not
      if (!files.product_image) {
        return res.status(400).json({ message: "Please Upload Files." });
      }

      // check Category exist or not
      if (!cate_id || cate_id == 0) {
        return res.status(400).json({ message: "Please Select Category." });
      }

      // configuration of path and name
      // old path where file availbale
      const oldPath = files.product_image[0].filepath; // Access the path of the uploaded image
      // new path
      const nFileName = `${Date.now()}.${
        files.product_image[0].originalFilename
      }`;
      // remove space
      const newFileName = nFileName.replace(/\s/g, "");
      // project dir
      const projectDirectory = path.resolve(
        __dirname,
        "../../../../../public/assets/upload/blogs"
      );
      // combine path and image name
      const newPath = path.join(projectDirectory, newFileName);

      // copy img from old path to new path
      fs.copyFile(oldPath, newPath, async (moveErr) => {
        if (moveErr) {
          console.log(moveErr);
          res.status(500).json({ message: "File Upload failed." });
        } else {
          try {
            console.log(fields);
            // db operation
            const [row] = await conn.query(
              "INSERT INTO blog_master SET ? ",
              {
                cate_id: cate_id,
                product_title: product_title,
                product_short_desc: product_short_desc,
                product_long_desc: product_long_desc,
                meta_tag: meta_tag,
                meta_desc: meta_desc,
                meta_keyword: meta_keyword,
                canonical_url: canonical_url,
                product_image: newFileName,
                status: 1,
              }
            );
            res.status(200).json(row);
          } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to Add Product Category" });
          }
        }
      });
    });
  }

  if (req.method == "GET") {
    try {
      // Query the database

      const q = "SELECT * FROM `blog_master`";
      console.log(q);
      const [rows] = await conn.query(q);
      console.log(rows);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
