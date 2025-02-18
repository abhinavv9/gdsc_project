import React, { Fragment, useEffect, useState } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions//productActions.js";
import MetaData from "../../components/layouts/MetaData.js";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Loader from '../layouts/Loader/Loader';
import ReviewCard from "./ReviewCard";
import ReactStars from "react-rating-stars-component";
import {useAlert} from "react-alert";

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [quantity, setQuantity] = useState(1);
//   const [open, setOpen] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
      if(error){
          alert.error(error.message)
          dispatch(clearErrors())
      }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert]);


  const options = {
    value: product.ratings,
    edit: false,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel
                showIndicators="false"
                showThumbs="false"
                width="25vmax"
              >
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button>+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    //   onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>
                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
              <button className="submitReview">Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
