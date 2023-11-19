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
  //filter Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value
  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };
  useEffect(() => {
    setFilterdTestimonial(
      getAllTestimonial.filter((e) => {
        let data = e.testimonial_title;
        return data.includes(filterValue);
      })
    );
  }, [filterValue]);
  // filter End

  // set states start
  const router = useRouter();
  const [filterdTestimonial, setFilterdTestimonial] = useState([]);
  const [getAllTestimonial, setGetAllTestimonial] = useState([]);
  const [loading, setLoading] = useState(true);
  // set states end

  //get all testimonial data
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

  // show the star rating
  const starArray = Array.from({ length: 5 }, (_, index) => index + 1);

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

  // edit testimonial start
  const handleEditTestimonial = (testimonialId) => {
    setLoading(true);
    router.push(`/admin/testimonial/edit-testimonial?id=${testimonialId}`);
  };
  // edit testimonial end

  // handle delete testimonial start
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const openDeleteModal = (deleteTestimonialId) => {
    setDeleteId(deleteTestimonialId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };
  const deleteTestimonial = () => {
    if (deleteId) {
      deleteTestimonialData(deleteId);
      closeDeleteModal();
    }
  };

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

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header />
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
                <th style={{ width: "15%", textAlign: "center" }}>TITLE</th>
                <th style={{ width: "30%", textAlign: "center" }}>
                  DESCRIPTION
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>IMAGE</th>
                <th style={{ width: "30%", textAlign: "center" }}>VIDEO</th>
                <th style={{ width: "15%", textAlign: "center" }}>RATING</th>
                <th style={{ width: "20%", textAlign: "center" }}>OPERATION</th>
                <th style={{ width: "10%", textAlign: "center" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filterdTestimonial.length > 0 ? (
                filterdTestimonial.map((testimonial, index) => (
                  <tr key={testimonial.id} style={{ textAlign: "center" }}>
                    <td>{index + 1}</td>
                    <td>{testimonial.testimonial_title}</td>
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

                    <td>
                      {testimonial.rating && (
                        <div className="star-rating">
                          {starArray.map((star) => (
                            <span
                              key={star}
                              style={{
                                cursor: "pointer",
                                fontSize: "24px",
                                color:
                                  star <= testimonial.rating
                                    ? "#f8d64e"
                                    : "#ddd",
                                marginRight: "5px",
                              }}
                            >
                              &#9733;
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
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
                <tr>
                  <td colSpan="5" align="center">
                    data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* delete modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteTestimonial}
        />
        <Toast />
      </section>
    </>
  );
};

export default Testimonials;