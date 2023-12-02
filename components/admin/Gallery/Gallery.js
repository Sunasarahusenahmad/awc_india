import Header from "@/layouts/Header";
import Loading from "@/layouts/Loading";
import Link from "next/link";
import React, { useState } from "react";

const Gallery = () => {
  const [loading, setLoading] = useState(true);

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
      </section>
    </>
  );
};

export default Gallery;
