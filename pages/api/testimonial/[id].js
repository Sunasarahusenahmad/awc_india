import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";
const { unlink } = require("fs").promises;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const getPerTestimonialDataQuery =
        "SELECT * FROM `testimonial` WHERE id = ?";

      const data = [id];
      const [rows] = await conn.query(getPerTestimonialDataQuery, data);

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Can not Get Testimonial Per Data... check connection",
      });
    }
  }

  //   if (req.method == "PUT") {
  //     try {
  //       const form = new IncomingForm();
  //       form.parse(req, async (err, fields, files) => {
  //         // check file exist or not
  //         const {
  //           testimonial_title,
  //           testimonial_desc,
  //           testimonial_video,
  //           testimonial_rating,
  //         } = fields;

  //         let sql = "";
  //         let params = [];

  //         if (!files.testimonial_image) {
  //           sql =
  //             "UPDATE `testimonial` SET `testimonial_title`= ?, `testimonial_desc`= ?, `testimonial_video`= ?, `rating`= ? WHERE id = ?";

  //           params = [
  //             testimonial_title,
  //             testimonial_desc,
  //             testimonial_video,
  //             testimonial_rating,
  //             id,
  //           ];
  //         } else {
  //           // Configuration for the new image
  //           const oldPath = files.testimonial_image[0].filepath; // Old path of the uploaded image
  //           const nFileName = `${Date.now()}.${
  //             files.testimonial_image[0].originalFilename
  //           }`;
  //           const newFileName = nFileName.replace(/\s/g, "");
  //           const projectDirectory = path.resolve(
  //             __dirname,
  //             "../../../../../public/assets/upload/testimonial"
  //           );
  //           const newPath = path.join(projectDirectory, newFileName);

  //           // Copy the new image from the old path to the new path
  //           fs.copyFile(oldPath, newPath, (moveErr) => {
  //             if (moveErr) {
  //               console.log(moveErr);
  //               return res.status(500).json({ message: "File move failed." });
  //             }
  //           });

  //           sql =
  //             "UPDATE `testimonial` SET `testimonial_title`= ?, `testimonial_desc`= ?, `testimonial_image`= ?, `testimonial_video`= ?, `rating`= ? WHERE id = ?";

  //           params = [
  //             testimonial_title,
  //             testimonial_desc,
  //             newFileName,
  //             testimonial_video,
  //             testimonial_rating,
  //             id,
  //           ];
  //         }

  //         const result = await conn.query(sql, params);
  //         res.status(200).json(result);
  //       });
  //     } catch (err) {
  //       res.status(500).json({ message: "Testimonial Updation Failed" });
  //     }
  //   }

  if (req.method == "PUT") {
    let result; // result outside the try block
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        // check file exist or not
        const {
          testimonial_title,
          testimonial_desc,
          testimonial_video,
          testimonial_rating,
        } = fields;

        let sql = "";
        let params = [];

        let testimonial; // declare testimonial variable

        // Fetch testimonial data
        [testimonial] = await conn.query(
          "SELECT testimonial_image FROM  testimonial WHERE id = ?",
          [id]
        );

        if (!files.testimonial_image) {
          sql =
            "UPDATE `testimonial` SET `testimonial_title`= ?, `testimonial_desc`= ?, `testimonial_video`= ?, `rating`= ? WHERE id = ?";

          params = [
            testimonial_title,
            testimonial_desc,
            testimonial_video,
            testimonial_rating,
            id,
          ];
          result = await conn.query(sql, params);
        } else {
          // Configuration for the new image
          const oldPath = files.testimonial_image[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${
            files.testimonial_image[0].originalFilename
          }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../public/assets/upload/testimonial"
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
            "UPDATE `testimonial` SET `testimonial_title`= ?, `testimonial_desc`= ?, `testimonial_image`= ?, `testimonial_video`= ?, `rating`= ? WHERE id = ?";

          params = [
            testimonial_title,
            testimonial_desc,
            newFileName,
            testimonial_video,
            testimonial_rating,
            id,
          ];
          result = await conn.query(sql, params);
          // Delete the old image
          if (testimonial.length !== 0) {
            const oldImage = testimonial[0].testimonial_image;
            const oldImagePath = path.join(projectDirectory, oldImage);
            await unlink(oldImagePath);
          }
        }

        res.status(200).json(result);
      });
    } catch (err) {
      res.status(500).json({ message: "Testimonial Updation Failed" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method === "DELETE") {
    try {
      // first get testimonial data

      const [testimonial] = await conn.query(
        "SELECT testimonial_image FROM  testimonial WHERE id = ?",
        [id]
      );

      // Query for delete data
      const q = "DELETE FROM testimonial WHERE id = ?";

      const [rows] = await conn.query(q, [id]);

      //check image awailable or not
      let testimonialImage = "";
      if (testimonial.length != 0) {
        testimonialImage = testimonial[0].testimonial_image;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/testimonial"
        );
        const newPath = path.join(projectDirectory, testimonialImage);
        console.log(newPath);
        await unlink(newPath);
      }

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Cannot Delete Testimonial... Check Connection" });
    }
  }
}
