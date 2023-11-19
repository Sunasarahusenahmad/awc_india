// api/category/[id].js

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
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `blog_master` WHERE blog_id = ?";

      const data = [id];
      const [rows] = await conn.query(q, data);

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Can not Get category... check connection" });
    }
  }

  if (req.method == "DELETE") {
    try {
      const { id } = req.query;
      console.log(id);
      // Query the database
      const q = "DELETE FROM blog_master WHERE blog_id = ?";

      const [rows] = await conn.query(q, [id]);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Cannot Delete Category... Check Connection" });
    }
  }

  if (req.method == "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        // check file exist or not
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

        let sql = "";
        let params = [];
        const upadatedDate = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        if (!files.product_image) {
          sql =
            "UPDATE `blog_master` SET `blog_title`= ?, `blog_description`= ?, `meta_tag`= ?, `meta_desc`= ?, `meta_keyword`= ?, `canonical_url`= ?, `updated_date`= ?, `blog_cate_id`= ?  WHERE blog_id = ?";

          params = [
            cate_id,
            product_title,
            product_short_desc,
            product_long_desc,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            upadatedDate,
            id,
          ];

        } else {
          // Configuration for the new image
          const oldPath = files.product_image[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${
            files.product_image[0].originalFilename
          }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../public/assets/upload/blogs"
          );
          const newPath = path.join(projectDirectory, newFileName);

          // Copy the new image from the old path to the new path
          fs.copyFile(oldPath, newPath, (moveErr) => {
            if (moveErr) {
              console.log(moveErr);
              return res.status(500).json({ message: "File move failed." });
            }
          });

          sql =
          "UPDATE `blog_master` SET `blog_title`= ?, `blog_thumbnail`= ?, `blog_description`= ?, `meta_tag`= ?, `meta_desc`= ?, `meta_keyword`= ?, `canonical_url`= ?, `updated_date`= ?, `blog_cate_id`= ?  WHERE blog_id = ?";

          params = [
            cate_id,
            product_title,
            product_short_desc,
            product_long_desc,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            newFileName,
            upadatedDate,
            id,
          ];
        }

        const result = await conn.query(sql, params);
        res.status(200).json(result);
      });
    } catch (err) {
      res.status(500).json({ message: "Category Updation Failed" });
    }
  }
}
