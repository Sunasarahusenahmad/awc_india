import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/layouts/Header";
import Link from "next/link";
import { useRouter } from "next/router";
 
const AddProdCategory = () => {
  const router = useRouter();
  const [getActiveCateData, setGetActiveCateData] = useState([]);
  const [addProductCategoryData, setAddProductCategoryData] = useState({
    category_name: "",
    category_title: "",
    meta_description: "",
    canonical_url: "",
    category_description: "",
    category_image: null,
    sub_category: "",
  });
  const [addMetaTag, setAddMetaTag] = useState([]);
  const [addMetaKeyword, setAddMetaKeyword] = useState([]);

  //get active category
  const getActiveCategoryData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/productcategorychanges/router`);
      console.log(response.data[0]);
      setGetActiveCateData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  //add product data section start
  const handleChangeProductCategory = (event) => {
    const { name, value } = event.target;
    setAddProductCategoryData((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };
  const handleAddFileChange = (event) => {
    const file = event.target.files[0];
    setAddProductCategoryData((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };


  //save category
  const addCategoryData = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("category_name", addProductCategoryData.category_name);
      formdata.append("category_title", addProductCategoryData.category_title);
      formdata.append(
        "meta_description",
        addProductCategoryData.meta_description
      );
      formdata.append("canonical_url", addProductCategoryData.canonical_url);
      formdata.append(
        "category_description",
        addProductCategoryData.category_description
      );
      formdata.append("category_image", addProductCategoryData.category_image);
      formdata.append("sub_category", addProductCategoryData.sub_category);
      formdata.append("meta_tag", addMetaTag);
      formdata.append("meta_keyword", addMetaKeyword);
      
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      };


      const url = `${process.env.NEXT_PUBLIC_API_URL}/productcategory/router`;
      const res = await axios.post(url, formdata, config);

      router.push("/admin/product-category");
    } catch (error) {
      console.error("Error adding Alumniprofile data in Profile.js:", error);
    }
  };

  // add meta keyword
  const handleKeyword = (event) => {
    if (event.key === "Enter" || event.key == ",") {
      event.preventDefault();
      setAddMetaKeyword([...addMetaKeyword, event.target.value]);
      event.target.value = "";
    }
  };
  const RemoveKeyword = (idx) => {
    const newArray = [...addMetaKeyword];
    newArray.splice(idx, 1);
    setAddMetaKeyword(newArray);
  };

  // add meta tags
  const handleTags = (event) => {
    if (event.key === "Enter" || event.key == ",") {
      event.preventDefault();
      setAddMetaTag([...addMetaTag, event.target.value.trim()]);
      event.target.value = "";
    }
  };
  const RemoveTags = (idx) => {
    const newArray = [...addMetaTag];
    newArray.splice(idx, 1);
    setAddMetaTag(newArray);
  };

  useEffect(() => {
    getActiveCategoryData();
  }, []);
  return (
    <>
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Add Product Category</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Product Category</span>
          </p>
        </div>
        <div className="add_data_form">
          <form method="post" onSubmit={addCategoryData}>
            <div className="mb-3">
              <label htmlFor="category_name" className="modal_label">
                Category Name:-
              </label>
              <input
                type="text"
                id="category_name"
                name="category_name"
                className="modal_input"
                placeholder="Enter Category Name"
                onChange={handleChangeProductCategory}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category_title" className="modal_label">
                Category Title:-
              </label>
              <input
                type="text"
                id="category_title"
                name="category_title"
                className="modal_input"
                placeholder="Enter Category Title"
                onChange={handleChangeProductCategory}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="meta_tag" className="modal_label">
                Meta Tag:-
              </label>
              <input
                type="text"
                id="meta_tag"
                name="meta_tag"
                className="modal_input"
                placeholder="Enter Meta Tag"
                onKeyDown={handleTags}
              />
            </div>
            <div className="mb-3">
              {addMetaTag.map((tag, index) => (
                <div className="meta_tag_section" key={index}>
                  <div className="meta_tag_text">{tag}</div>
                  <div className="meta_remove_icon">
                    <i
                      className="fa-solid fa-xmark"
                      onClick={() => {
                        RemoveTags(index);
                      }}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label htmlFor="meta_description" className="modal_label">
                Meta Description:-
              </label>
              <textarea
                type="text"
                rows="5"
                cols="70"
                id="meta_description"
                name="meta_description"
                className="modal_input"
                placeholder="Enter Meta Description"
                onChange={handleChangeProductCategory}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="meta_keyword" className="modal_label">
                Meta Keayword:-
              </label>
              <input
                type="text"
                id="meta_keyword"
                name="meta_keyword"
                className="modal_input"
                placeholder="Enter Meta Keyword"
                onKeyDown={handleKeyword}
              />
            </div>
            <div className="mb-3">
              {addMetaKeyword.map((keyword, index) => (
                <div className="meta_tag_section" key={index}>
                  <div className="meta_tag_text">{keyword}</div>
                  <div className="meta_remove_icon">
                    <i
                      className="fa-solid fa-xmark"
                      onClick={() => {
                        RemoveKeyword(index);
                      }}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label htmlFor="canonical_url" className="modal_label">
                Conanical URL:-
              </label>
              <input
                type="text"
                id="canonical_url"
                name="canonical_url"
                className="modal_input"
                placeholder="Enter Conanical URL"
                onChange={handleChangeProductCategory}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category_description" className="modal_label">
                Category Description:-
              </label>
              <textarea
                type="text"
                rows="5"
                cols="70"
                id="category_description"
                name="category_description"
                className="modal_input"
                placeholder="Enter Category Description"
                onChange={handleChangeProductCategory}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category_image" className="modal_label">
                Category Image:-
              </label>
              <input
                type="file"
                id="category_image"
                name="category_image"
                className="modal_input"
                onChange={handleAddFileChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="sub_category" className="modal_label">
                Choose Sub Category:
              </label>
              <select
                name="sub_category"
                id="sub_category"
                form="sub_category"
                className="modal_input"
                onChange={handleChangeProductCategory}
              >
                <option value={0}>Choose Sub Category</option>
                {getActiveCateData.map((cate) => {
                  return (
                    <option key={cate.category_id} value={cate.category_id}>
                      {cate.category_name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <button type="submit" className="success_btn">
                SAVE
              </button>
              <Link href="/admin/products-category">
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

export default AddProdCategory;