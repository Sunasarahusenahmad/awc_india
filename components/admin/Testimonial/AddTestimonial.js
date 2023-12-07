import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import { ErrorToast } from "@/layouts/toast/Toast";
import axios from "axios";

const AddTestimonial = () => {
  const starArray = [1, 2, 3, 4, 5];
  const [loading, setLoading] = useState(false);

  // handle state for add data
  const [addTestimonialData, setAddTestimonialData] = useState({
    testimonial_title: "",
    testimonial_desc: "",
    testimonial_image: null,
    testimonial_video: "",
    testimonial_rating: 0,
    product_id: "",
  });
  // handled the testimonial input values
  const handleChangeTestimonial = async (event) => {
    const { name, value } = event.target;
    setAddTestimonialData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // editor start
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setAddTestimonialData((prevData) => ({
      ...prevData,
      testimonial_desc: content,
    }));
  };
  // editor end

  // file handle start
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    // Check if the file has a valid extension
    const validExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      // Reset the input value to clear the invalid file
      event.target.value = "";
      return;
    }

    setAddTestimonialData((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));

    setSelectedImage(file);
  };
  // file handle end

  // rating start
  const handleStarClick = (selectedRating) => {
    setAddTestimonialData((prevData) => ({
      ...prevData,
      testimonial_rating: selectedRating,
    }));
  };
  // rating end

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
      formData.append("product_id", addTestimonialData.product_id);

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

  //get or fetch all product data start
  const [getProductData, setGetProductData] = useState([]);

  const getAllProductData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products/router`)
      .then((res) => {
        setGetProductData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all product data
  useEffect(() => {
    getAllProductData();
  }, []);
  //get or fetch all product data end

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
            {/* Product Category */}
            <div className="mb-3">
              <label htmlFor="product_id" className="modal_label">
                <span style={{ color: "red" }}>*</span> Select Product:-
              </label>
              <select
                id="product_id"
                name="product_id"
                className="modal_input"
                onChange={handleChangeTestimonial}
                required
              >
                <option value="">-- Select Product --</option>
                {getProductData.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.product_title}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
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

            {/* Description */}
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

            {/* Image */}
            <div className="mb-3">
              <label htmlFor="testimonial_image" className="modal_label">
                Testimonial Image:-{" "}
                <span style={{ color: "red" }}>
                  (* Only jpg, png and jpeg file supported)
                </span>
              </label>
              {/* Display the selected image immediately */}
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  width="100px"
                  height="100px"
                  alt="profile"
                />
              )}
              <input
                type="file"
                id="testimonial_image"
                name="testimonial_image"
                className="modal_input"
                onChange={handleFileChange}
              />
            </div>

            {/* Video */}
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

            {/* Rating */}
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

            {/* Handle Button Save and Cancle */}
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

export default AddTestimonial;
