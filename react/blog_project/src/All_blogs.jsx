import { React, useState } from "react";
import "./all_blogs.css";
import { RiAccountCircleLine } from "react-icons/ri";
import { LuDot } from "react-icons/lu";
import { blogData } from "./Data";
import { BiSolidLike } from "react-icons/bi";

function All_blogs() {
  const [likedPosts, setLikedPosts] = useState({});
  const handleLike = (postId) => {
    setLikedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  let allData = blogData.map((v, i) => {
    return (
      <div className="flx">
        <div className="img_cont">
          <img src="src/assets/back_img.webp" alt="" />
        </div>
        <div className="main_cont_content">
          <div className="admin_cont">
            <div className="ad_cont_01">
              <RiAccountCircleLine size={"40px"} />
              <p>Admin</p>
              <p>mar 21, 2023</p>
              <LuDot />
              <p>1 min</p>
            </div>
            <div className="ad_cont_02">
              <h1>{v.title}</h1>
              <p>{v.paragraph}</p>
              <hr />

              <div className="flex_bx_coment">
                <div className="flex_01">
                  <p>{v.comments.length} comments</p>
                  <p>{v.views} views</p>
                </div>
                <div className={`btn_flex_box `}>
                  <button
                    className={`btn_like `}
                    onClick={() => handleLike(v.id)}
                    style={{ color: likedPosts[v.id] ? "red" : "black" }}
                  >
                    <BiSolidLike size={"22px"} />
                    {likedPosts[v.id] ? ` liked ` : ``}
                  </button>
                  {/* <p>{v.likes} </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div>
      <br />
      <br />
      <br />
      <div className="main_all_flex">{allData}</div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default All_blogs;
