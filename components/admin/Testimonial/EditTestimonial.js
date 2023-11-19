import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import { ErrorToast } from "@/layouts/toast/Toast";
import axios from "axios";
import { useRouter } from "next/router";

const EditTestimonial = () => {
  // loading
  const [loading, setLoading] = useState(false);

  // set the edit testimonial data state
  const [editTestimonialData, setEditTestimonialData] = useState({
    testimonial_title: "",
    testimonial_desc: "",
    testimonial_image: null,
    testimonial_video: "",
    testimonial_rating: 0,
  });

  // get per testimonial data start
  const router = useRouter();

  let testimonialId = router.query.id;

  const getPerTestimonialData = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/testimonial/${id}`;
      const response = await axios.get(url);
      const fetchedData = response.data[0];
      setEditTestimonialData({
        ...fetchedData,
        testimonial_rating: parseInt(fetchedData.rating), // it's a number
      });
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPerTestimonialData(testimonialId);
  }, [testimonialId]);
  // get per testimonial data end

  // handled the testimonial values
  const handleChangeTestimonial = async (event) => {
    const { name, value } = event.target;
    setEditTestimonialData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //editor
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setEditTestimonialData((prevData) => ({
      ...prevData,
      testimonial_desc: content,
    }));
  };
  //end

  // file handle start
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setEditTestimonialData((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));
  };
  // file handle end

  // rating code start
  const starArray = Array.from({ length: 5 }, (_, index) => index + 1);

  const handleStarClick = (selectedRating) => {
    setEditTestimonialData((prevData) => ({
      ...prevData,
      testimonial_rating: selectedRating,
    }));
  };
  // rating code end

  // edit data into testimonial database table
  const editData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "testimonial_title",
        editTestimonialData.testimonial_title
      );
      formData.append("testimonial_desc", editorRef.current.getContent());
      formData.append(
        "testimonial_image",
        editTestimonialData.testimonial_image
      );
      formData.append(
        "testimonial_video",
        editTestimonialData.testimonial_video
      );
      formData.append(
        "testimonial_rating",
        editTestimonialData.testimonial_rating
      );
      console.log(formData);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonial/${testimonialId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(formData);
      console.log(res);
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
          <p className="admin_page_header">Edit Testimonial</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Testimonial</span>
          </p>
        </div>

        <div className="add_data_form">
          <form method="post" onSubmit={editData}>
            <div className="mb-3">
              <label htmlFor="product_title" className="modal_label">
                Testimonial Title:-
              </label>
              <input
                type="text"
                id="testimonial_title"
                name="testimonial_title"
                className="modal_input"
                placeholder="Enter Testimonial Title"
                value={editTestimonialData?.testimonial_title}
                onChange={handleChangeTestimonial}
                required
              />
            </div>

            <div className="mb-3">
              <p className="modal_label">Testimonial Description:-</p>
              <Editor
                apiKey="d6ora8dyhvnc8zu7h9yflnh9ph9ojwx2p7titaqjpd66jf37"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={editTestimonialData?.testimonial_desc}
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
                Testimonial Image:-
              </label>
              <img
                src={`/assets/upload/testimonial/${editTestimonialData?.testimonial_image}`}
                width="100px"
                height="100px"
                alt="profile"
              />
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
                placeholder="Enter Testimonial Title"
                value={editTestimonialData?.testimonial_video}
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
                        star <= editTestimonialData.testimonial_rating
                          ? "#f8d64e"
                          : "#ddd",
                      marginRight: "5px",
                    }}
                    onClick={() => handleStarClick(star)}
                  >
                    &#9733;
                  </span>
                ))}
                <p>{editTestimonialData.testimonial_rating} stars</p>
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

export default EditTestimonial;
