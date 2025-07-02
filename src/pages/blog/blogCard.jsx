import React from "react";

const BlogCard = ({ post, onReadMore }) => {
  return (
    <div className="BlogCard">
      <div className="BlogCardImage">
        <img src={post.image} alt={post.title} loading="lazy" />
        <div className="CategoryBadge">{post.category}</div>
      </div>
      
      <div className="BlogCardContent">
        <h4 className="Head_4">{post.title}</h4>
        <p className="Pra_1">{post.summary}</p>
        
        <div className="BlogCardMeta">
          <span className="Date">
            <i className="fas fa-calendar-alt"></i>
            {post.date}
          </span>
          <span className="ReadTime">
            <i className="fas fa-clock"></i>
            {post.readTime} min read
          </span>
        </div>
        
        <button 
          className="BtnBorder ReadMoreBtn"
          onClick={onReadMore}
        >
          Read More
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default BlogCard; 