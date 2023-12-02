import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import Toast, { ErrorToast } from "@/layouts/toast/Toast";
import axios from "axios";

const AddGallery = () => {
  const [loading, setLoading] = useState(false);

  // Change to use addMultiImages for managing multiple images
  const [addMultiImages, setAddMultiImages] = useState({
    gallery_images: [],
  });

  console.log(addMultiImages);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCategories, setImageCategories] = useState([]);

  // handled the gallery category values start
  const handleCategoryChange = (e, index) => {
    const selectedCategoryTitle = e.target.value;

    const isCategorySelected = imageCategories[index]?.some(
      (category) => category.category_title === selectedCategoryTitle
    );

    e.target.value = "";

    if (!isCategorySelected) {
      const selectedCategory = getAllGalleryCategory.find(
        (category) => category.category_title === selectedCategoryTitle
      );

      if (selectedCategory) {
        const updatedCategories = [...imageCategories];
        updatedCategories[index] = [
          ...(updatedCategories[index] || []),
          selectedCategory,
        ];

        setImageCategories(updatedCategories);
        e.target.value = "";
      }
    }
  };

  const handleRemoveCategory = (index, categoryId) => {
    const updatedCategories = [...imageCategories];
    updatedCategories[index] = updatedCategories[index].filter(
      (category) => category.id !== categoryId
    );
    setImageCategories(updatedCategories);
  };
  // handled the gallery category values end

  // Add multiple images and multiple categories handler
  const handleAddMultipleImagesChange = (event) => {
    const files = event.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const newImage = {
        file: files[i],
        category: "", // Initialize category as an empty string
      };

      newImages.push(newImage);
    }

    // Change to use addMultiImages.gallery_images
    setAddMultiImages((prevImages) => ({
      ...prevImages,
      gallery_images: [...prevImages.gallery_images, ...newImages],
    }));

    const newPreviews = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  // Function to handle the removal of an image
  const handleRemoveImage = (index) => {
    // Update addMultiImages state
    setAddMultiImages((prevImages) => {
      const updatedImages = [...prevImages.gallery_images];
      updatedImages.splice(index, 1); // Remove the image at the specified index
      return { gallery_images: updatedImages };
    });

    // Update imagePreviews state
    setImagePreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews];
      updatedPreviews.splice(index, 1); // Remove the preview at the specified index
      return updatedPreviews;
    });

    // Update imageCategories state
    setImageCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories.splice(index, 1); // Remove the categories at the specified index
      return updatedCategories;
    });
  };

  const handleChangeGallery = (e, index) => {
    const newGalleryData = [...addMultiImages.gallery_images];
    newGalleryData[index].category = e.target.value;
    newGalleryData[index].sort = e.target.value;

    // Change to use setAddMultiImages
    setAddMultiImages((prevImages) => ({
      ...prevImages,
      gallery_images: newGalleryData,
    }));
  };

  // Save gallery data with multiple images and categories
  const addData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    try {
      const formData = new FormData();

      addMultiImages.gallery_images.forEach((image, index) => {
        formData.append(`gallery_images`, image.file);
        formData.append(`gallery_title_${index}`, image.category);
        formData.append(`gallery_sort_${index}`, image.sort);

        // Append all category IDs associated with the current image
        imageCategories[index].forEach((category, categoryIndex) => {
          formData.append(
            `gallery_categories_${index}_${categoryIndex}`,
            category.id
          );
        });
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/router`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      router.push("/admin/gallery");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //get or fetch all gallery category data start
  const [getAllGalleryCategory, setGetAllGalleryCategory] = useState([]);

  const getAllGalleryCategoryData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/router`)
      .then((res) => {
        setGetAllGalleryCategory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all gallery category data
  useEffect(() => {
    getAllGalleryCategoryData();
  }, []);
  //get or fetch all gallery category data end

  return (
    <>
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Add Image</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Image</span>
          </p>
        </div>

        <div className="add_data_form">
          <form method="post" onSubmit={addData}>
            {/* <div className="mb-3">
              <label htmlFor="product_title" className="modal_label">
                <span style={{ color: "red" }}>*</span> Gallery Title:-
              </label>
              <input
                type="text"
                id="gallery_title"
                name="gallery_title"
                className="modal_input"
                placeholder="Enter Gallery Title"
                onChange={handleChangeGallery}
                required
              />
            </div> */}

            {/* <div className="mb-3">
              <label htmlFor="cate_id" className="modal_label">
                Choose Category:
              </label>
              <input
                list="categories"
                name="cate_id"
                id="cate_id"
                className="modal_input"
                onChange={(e) => handleCategoryChange(e)}
                multiple
              />
              <datalist id="categories">
                {getAllGalleryCategory.map((category) => (
                  <option key={category.id} value={category.category_title} />
                ))}
              </datalist>

              <ul
                style={{
                  paddingTop: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  listStyleType: "none",
                  padding: "10px",
                }}
              >
                {selectedCategories.map((category) => (
                  <li key={category.id}>
                    {category.category_title}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category.id)}
                    >
                      <i
                        class="fa-solid fa-circle-minus"
                        style={{
                          color: "red",
                          paddingLeft: "20px",
                          fontSize: "20px",
                        }}
                      ></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div> */}

            <div className="mb-3">
              <label htmlFor="gallery_image" className="modal_label">
                Choose Images:{" "}
                <span style={{ color: "red" }}>
                  (* Only jpg, png, and jpeg files supported)
                </span>
              </label>
              <input
                type="file"
                id="gallery_image"
                name="gallery_image"
                className="modal_input"
                onChange={handleAddMultipleImagesChange}
                multiple
              />
            </div>

            {/* Display image previews with input boxes */}
            {/* <div
              className="image-previews"
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  style={{ marginRight: "10px", marginBottom: "10px" }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    style={{ width: "200px", height: "150px" }}
                  />
                  <div className="mt-3">
                    <label
                      htmlFor={`gallery_title_${index}`}
                      className="modal_label"
                    >
                      <span style={{ color: "red" }}>*</span> Gallery Title:-
                    </label>
                    <input
                      type="text"
                      id={`gallery_title_${index}`}
                      name={`gallery_title_${index}`}
                      className="modal_input"
                      placeholder={`Enter Gallery Title ${index + 1}`}
                      onChange={(e) => handleChangeGallery(e, index)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div> */}

            {/* <div
              className="image-previews"
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  style={{ marginRight: "10px", marginBottom: "10px" }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    style={{ width: "200px", height: "150px" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    delete
                  </button>
                  <div className="mt-3">
                    <label
                      htmlFor={`gallery_title_${index}`}
                      className="modal_label"
                    >
                      <span style={{ color: "red" }}>*</span> Gallery Title:-
                    </label>
                    <input
                      type="text"
                      id={`gallery_title_${index}`}
                      name={`gallery_title_${index}`}
                      className="modal_input"
                      placeholder={`Enter Gallery Title ${index + 1}`}
                      onChange={(e) => handleChangeGallery(e, index)}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`gallery_category_${index}`}
                      className="modal_label"
                    >
                      Choose Category:
                    </label>
                    <input
                      list={`categories_${index}`}
                      name={`cate_id_${index}`}
                      id={`cate_id_${index}`}
                      className="modal_input"
                      onChange={(e) => handleCategoryChange(e, index)}
                    />
                    <datalist id={`categories_${index}`}>
                      {getAllGalleryCategory.map((category) => (
                        <option
                          key={category.id}
                          value={category.category_title}
                        />
                      ))}
                    </datalist>
                    <ul
                      style={{
                        paddingTop: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        listStyleType: "none",
                        padding: "10px",
                      }}
                    >
                      {(imageCategories[index] || []).map((category) => (
                        <li key={category.id}>
                          {category.category_title}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveCategory(index, category.id)
                            }
                          >
                            <i
                              className="fa-solid fa-circle-minus"
                              style={{
                                color: "red",
                                paddingLeft: "20px",
                                fontSize: "20px",
                              }}
                            ></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Display images in a table */}
            <table className="image-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Sort</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {imagePreviews.map((preview, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{ width: "100px", height: "75px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id={`gallery_title_${index}`}
                        name={`gallery_title_${index}`}
                        className="modal_input"
                        placeholder={`Enter Gallery Title ${index + 1}`}
                        onChange={(e) => handleChangeGallery(e, index)}
                      />
                    </td>
                    <td>
                      <input
                        list={`categories_${index}`}
                        name={`cate_id_${index}`}
                        id={`cate_id_${index}`}
                        className="modal_input"
                        onChange={(e) => handleCategoryChange(e, index)}
                      />
                      <datalist id={`categories_${index}`}>
                        {getAllGalleryCategory.map((category) => (
                          <option
                            key={category.id}
                            value={category.category_title}
                          />
                        ))}
                      </datalist>
                      <ul
                        style={{
                          paddingTop: "20px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          listStyleType: "none",
                          padding: "10px",
                        }}
                      >
                        {(imageCategories[index] || []).map((category) => (
                          <li key={category.id}>
                            {category.category_title}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveCategory(index, category.id)
                              }
                            >
                              <i
                                className="fa-solid fa-circle-minus"
                                style={{
                                  color: "red",
                                  paddingLeft: "20px",
                                  fontSize: "20px",
                                }}
                              ></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`gallery_sort_${index}`}
                        name={`gallery_sort_${index}`}
                        className="modal_input"
                        placeholder={`Gallery Sorting ${index + 1}`}
                        onChange={(e) => handleChangeGallery(e, index)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5">
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
        <Toast />
      </section>
    </>
  );
};

export default AddGallery;
