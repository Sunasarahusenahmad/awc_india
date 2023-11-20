import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import { ErrorToast } from "@/layouts/toast/Toast";
import axios from "axios";

const AddGallery = () => {
  const [loading, setLoading] = useState(false);

  const [addTestimonialData, setAddTestimonialData] = useState({
    testimonial_title: "",
    testimonial_desc: "",
    testimonial_image: null,
    testimonial_video: "",
    testimonial_rating: 0,
  });

  // handled the testimonial values
  const handleChangeTestimonial = async (event) => {
    const { name, value } = event.target;
    setAddTestimonialData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // file handle
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setAddTestimonialData((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));
  };

  // add data into testimonial database table
  const addData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(
        "testimonial_title",
        addTestimonialData.testimonial_title
      );
      formData.append("testimonial_desc", editorRef.current.getContent());
      formData.append(
        "testimonial_image",
        addTestimonialData.testimonial_image
      );
      formData.append(
        "testimonial_video",
        addTestimonialData.testimonial_video
      );
      formData.append(
        "testimonial_rating",
        addTestimonialData.testimonial_rating
      );

      console.log(formData);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonial/router`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );

      setLoading(false);
      router.push("/admin/testimonial");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Add Testimonial</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Testimonial</span>
          </p>
        </div>

        <div className="add_data_form">
          <form method="post" onSubmit={addData}>
            <div className="mb-3">
              <label htmlFor="product_title" className="modal_label">
                <span style={{ color: "red" }}>*</span> Testimonial Title:-
              </label>
              <input
                type="text"
                id="testimonial_title"
                name="testimonial_title"
                className="modal_input"
                placeholder="Enter Testimonial Title"
                onChange={handleChangeTestimonial}
                required
              />
            </div>
            <div className="mb-3">
              <span style={{ color: "red" }}>*</span>{" "}
              <p className="modal_label">Testimonial Description:-</p>
              <Editor
                apiKey="1ufup43ij0id27vrhewjb9ez5hf6ico9fpkd8qwsxje7r5bo"
                onInit={(evt, editor) => (editorRef.current = editor)}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                }}
                onChange={handleEditorChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="testimonial_image" className="modal_label">
                Testimonial Image:-{" "}
                <span style={{ color: "red" }}>
                  (* Only jpg and png file supported)
                </span>
              </label>
              <input
                type="file"
                id="testimonial_image"
                name="testimonial_image"
                className="modal_input"
                onChange={handleFileChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="testimonial_video" className="modal_label">
                Testimonial Video:-
              </label>
              <input
                type="text"
                id="testimonial_video"
                name="testimonial_video"
                className="modal_input"
                placeholder="Enter Testimonial Video Link"
                onChange={handleChangeTestimonial}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="testimonial_rating" className="modal_label">
                Testimonial Rating:-
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                {starArray.map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color:
                        star <= addTestimonialData.testimonial_rating
                          ? "#f8d64e"
                          : "#ddd",
                      marginRight: "5px",
                    }}
                    onClick={() => handleStarClick(star)}
                  >
                    &#9733;
                  </span>
                ))}
                <p>{addTestimonialData.testimonial_rating} stars</p>
              </div>
            </div>
            <div className="mb-3">
              <button type="submit" className="success_btn">
                SAVE
              </button>
              <Link href="/admin/testimonial">
                <button type="button" className="success_btn cancel_btn">
                  CANCEL
                </button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddGallery;
