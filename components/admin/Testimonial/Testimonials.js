import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/layouts/Header";
import { useRouter } from "next/router";
import axios from "axios";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";
import Loading from "@/layouts/Loading";
import DeleteModal from "@/layouts/DeleteModal";
import YouTube from "react-youtube";

const Testimonials = () => {
  //filter code Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value

  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilterdTestimonial(
      getAllTestimonial.filter((e) => {
        let data = e.testimonial_title.toLowerCase(); // Convert to lowercase
        return data.includes(filterValue.toLowerCase()); // Case-insensitive search
      })
    );
  }, [filterValue]);
  // filter code End

  // set states start
  const router = useRouter();
  const [filterdTestimonial, setFilterdTestimonial] = useState([]);
  const [getAllTestimonial, setGetAllTestimonial] = useState([]);
  const [loading, setLoading] = useState(true);
  // set states end

  //get or fetch all testimonial data start
  const getAllTestimonialData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/testimonial/router`)
      .then((res) => {
        setGetAllTestimonial(res.data);
        setFilterdTestimonial(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all testimonial data
  useEffect(() => {
    getAllTestimonialData();
  }, []);
  //get or fetch all testimonial data end

  // star rating array start
  const starArray = Array.from({ length: 5 }, (_, index) => index + 1);
  // star rating array end

  // status code start
  const testimonialStatusChange = async (testimonialId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonial/statuschanges/${testimonialId}/${no}`
      );
      getAllTestimonialData();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  // status code end

  // move edit testimonial page code start
  const handleEditTestimonial = (testimonialId) => {
    setLoading(true);
    router.push(`/admin/testimonial/edit-testimonial?id=${testimonialId}`);
  };
  // move edit testimonial page code end

  // handle delete testimonial start
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // open the modal
  const openDeleteModal = (deleteTestimonialId) => {
    setDeleteId(deleteTestimonialId);
    setIsDeleteModalOpen(true);
  };

  // close the modal
  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // delete the record
  const deleteTestimonial = () => {
    if (deleteId) {
      deleteTestimonialData(deleteId);
      closeDeleteModal();
    }
  };

  // delete code generate
  const deleteTestimonialData = async (deleteTestimonialId) => {
    setLoading(true);
    console.log(deleteTestimonialId);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonial/${deleteTestimonialId}`
      );
      // Move closeDeleteModal and SuccessToast here to ensure they are called after the deletion is successful
      closeDeleteModal();
      SuccessToast("Testimonial Deleted Successfully");
      getAllTestimonialData();
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  // handle delete testimonial end

  // handle youtube video start

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|y\/|\/v\/|\/e\/|watch\?.*v=)([^"&?\/\s]{11})/
    );

    return videoIdMatch ? videoIdMatch[1] : null;
  };
  // handle youtube video end

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
      {loading && <Loading />}
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Testimonial</p>
            <p>
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i className="fa-solid fa-angles-right"></i>
              <span>Testimonial</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/testimonial/add-testimonial">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Testimonial
              </button>
            </Link>
          </div>
        </div>
        <div className="admin_category_table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "5%", textAlign: "center" }}>ID</th>
                <th style={{ width: "10%", textAlign: "center" }}>PRODUCT</th>
                <th style={{ width: "15%", textAlign: "center" }}>TITLE</th>
                <th style={{ width: "30%", textAlign: "center" }}>
                  DESCRIPTION
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>IMAGE</th>
                <th style={{ width: "30%", textAlign: "center" }}>VIDEO</th>
                <th style={{ width: "15%", textAlign: "center" }}>RATING</th>
                <th style={{ width: "10%", textAlign: "center" }}>OPERATION</th>
                <th style={{ width: "10%", textAlign: "center" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filterdTestimonial.length > 0 ? (
                filterdTestimonial.map((testimonial, index) => (
                  <tr key={testimonial.id} style={{ textAlign: "center" }}>
                    {/* ID */}
                    <td>{index + 1}</td>

                    {/* Title */}
                    <td>
                      {getProductData.map(
                        (product) =>
                          product.product_id === testimonial.product_id && (
                            <span key={product.product_id}>
                              {product.product_title}
                            </span>
                          )
                      )}
                    </td>

                    {/* Title */}
                    <td>{testimonial.testimonial_title}</td>

                    {/* Description */}
                    <td>
                      <p
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: testimonial.testimonial_desc,
                        }}
                      ></p>
                    </td>

                    {/* Image */}
                    <td>
                      <img
                        src={`/assets/upload/testimonial/${testimonial.testimonial_image}`}
                        width="100px"
                        height="100px"
                        alt="testimonial"
                        className="tabel_data_image"
                        style={{
                          margin: "auto",
                        }}
                      />
                    </td>

                    {/* YouTube Video */}
                    <td>
                      {testimonial.testimonial_video && (
                        <YouTube
                          videoId={getYouTubeVideoId(
                            testimonial.testimonial_video
                          )}
                          opts={{
                            width: "250",
                            height: "150",
                            playerVars: {
                              autoplay: 0,
                            },
                          }}
                        />
                      )}
                    </td>

                    {/* Star Rating */}
                    <td>
                      <div className="star-rating">
                        {starArray.map((star) => (
                          <span
                            key={star}
                            style={{
                              cursor: "pointer",
                              fontSize: "24px",
                              color:
                                star <= (testimonial.rating || 0)
                                  ? "#f8d64e"
                                  : "#ddd",
                              marginRight: "5px",
                            }}
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Handle Operation that you want to perform */}
                    <td>
                      <span>
                        <button
                          className="operation_btn"
                          onClick={() => {
                            handleEditTestimonial(testimonial.id);
                          }}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button
                          className="operation_btn operation_delete_btn"
                          onClick={() => openDeleteModal(testimonial.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </span>
                    </td>

                    {/* Status  */}
                    <td>
                      {testimonial.status === 1 ? (
                        <img
                          src={"/assets/images/activeStatus.png"}
                          className="opr_active_btn"
                          onClick={() => {
                            testimonialStatusChange(testimonial.id, 1);
                          }}
                          alt="active"
                        />
                      ) : (
                        <img
                          src={"/assets/images/inActiveStatus.png"}
                          className="opr_active_btn"
                          onClick={() => {
                            testimonialStatusChange(testimonial.id, 0);
                          }}
                          alt="inActive"
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                // If data is not available in database so show this message
                <tr>
                  <td colSpan="5" align="center">
                    data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* delete modal component */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteTestimonial}
        />
        {/* Show the Toast notification */}
        <Toast />
      </section>
    </>
  );
};

export default Testimonials;
