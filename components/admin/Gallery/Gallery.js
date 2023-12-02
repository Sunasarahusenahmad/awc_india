import Header from "@/layouts/Header";
import Loading from "@/layouts/Loading";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category

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

  // get gallery data start
  const [galleryData, setGalleryData] = useState([]);

  const getGalleryData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/gallery/router`)
      .then((res) => {
        setGalleryData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };
  // get gallery data end

  // fetch all gallery category data
  useEffect(() => {
    getAllGalleryCategoryData();
    getGalleryData();
  }, []);
  //get or fetch all gallery category data end

  // Display only images based on the selected category
  const filteredGalleryData = galleryData.filter((image) =>
    selectedCategory ? image.gallery_category_id == selectedCategory : true
  );

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Gallery</p>
            <p>
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i className="fa-solid fa-angles-right"></i>
              <span>Gallery</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/gallery/gallery-category">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Category
              </button>
            </Link>

            <Link href="/admin/gallery/add-gallery">
              <button type="button" style={{ marginLeft: "20px" }}>
                <i className="fa-solid fa-plus"></i>Add Images
              </button>
            </Link>
          </div>
        </div>

        <div className="dropdown-container">
          <label htmlFor="categoryDropdown">Gallery Categories :</label>
          <select
            id="categoryDropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- All Category --</option>
            {getAllGalleryCategory.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_title}
              </option>
            ))}
          </select>
        </div>

        <div className="gallery-container">
          {filteredGalleryData.map((data) => (
            <div key={data.id} className="gallery-card">
              <img
                src={`/assets/upload/gallery/${data.gallery_image}`}
                alt={data.gallery_title}
                style={{ width: "200px", height: "250px" }}
              />
              <div className="card-buttons">
                <button
                  onClick={() => handleEdit(data.id)}
                  className="edit-button"
                >
                  <i class="fa-solid fa-pencil"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(data.id)}
                  className="delete-button"
                >
                  <i class="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Gallery;
