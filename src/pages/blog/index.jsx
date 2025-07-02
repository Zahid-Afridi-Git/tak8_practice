import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Loader from "../components/loader";

import { blogPosts } from "../../utils/blogData";

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const postsPerPage = 6;

  useEffect(() => {
    // Set page title and meta description
    document.title = "Travel Blog - TAK8 Car Rental | Perth Travel Guide";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Discover Perth and Western Australia with TAK8's travel blog. Expert travel guides, car rental tips, and local insights for your perfect journey.");
    }
    
    setTimeout(() => {
      setLoading(false);
      
      // Check if we need to restore scroll position
      const savedScrollPosition = sessionStorage.getItem('blogListScrollPosition');
      if (savedScrollPosition) {
        const shouldRestore = sessionStorage.getItem('shouldRestoreScroll');
        if (shouldRestore) {
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(savedScrollPosition),
              behavior: "smooth"
            });
            sessionStorage.removeItem('shouldRestoreScroll');
          }, 100);
        }
      }
    }, 500);
  }, []);

  // Get unique categories
  const categories = ["all", ...new Set(blogPosts.map(post => post.category))];

  // Filter posts by category
  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Get featured post (first post)
  const featuredPost = blogPosts[0];

  // Pagination logic for filtered posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleReadMore = (slug) => {
    // Save current scroll position before navigation
    sessionStorage.setItem('blogListScrollPosition', window.pageYOffset.toString());
    navigate(`/blog/${slug}`);
  };

  const getCategoryDisplayName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <>
      {loading ? <Loader /> : ""}
      <Header />
      


      {/* Blog Hero Section */}
      <section className="BlogHeroSection">
        <div className="container">
          <div className="CustomHeading text-center">
            <h1 className="Head_1">Travel & Tips</h1>
            <h2 className="Head_2">Explore Perth & Beyond</h2>
            <p className="Pra_1">
              Your ultimate guide to Perth and Western Australia. Discover hidden gems, get expert car rental tips, and plan unforgettable adventures.
            </p>
          </div>

          {/* Featured Blog Card */}
          {featuredPost && (
            <div className="FeaturedBlogCard">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
                  <div className="FeaturedImage">
                    <img src={featuredPost.image} alt={featuredPost.title} loading="lazy" />
                    <div className="CategoryBadge featured">{getCategoryDisplayName(featuredPost.category)}</div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="FeaturedContent">
                    <div className="BlogMeta mb-3">
                      <span className="Date">
                        <i className="fas fa-calendar-alt me-2"></i>
                        {featuredPost.date}
                      </span>
                      <span className="ReadTime">
                        <i className="fas fa-clock me-2"></i>
                        {featuredPost.readTime} min read
                      </span>
                    </div>
                    <h3 className="Head_4 mb-3">{featuredPost.title}</h3>
                    <p className="Pra_1 mb-4">{featuredPost.summary}</p>
                    <button 
                      className="BtnFill"
                      onClick={() => handleReadMore(featuredPost.slug)}
                    >
                      Read Article
                      <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="BlogListSection">
        <div className="container">


          {/* Blog Grid */}
          <div className="BlogGrid">
            <div className="row">
              {currentPosts.map((post, index) => (
                <div key={post.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-4">
                  <article className="BlogCard">
                    <div className="BlogCardImage">
                      <img src={post.image} alt={post.title} loading="lazy" />
                      <div className="CategoryBadge">{getCategoryDisplayName(post.category)}</div>
                    </div>
                    <div className="BlogCardContent">
                      <div className="BlogMeta">
                        <span className="Date">
                          <i className="fas fa-calendar-alt me-2"></i>
                          {post.date}
                        </span>
                        <span className="ReadTime">
                          <i className="fas fa-clock me-2"></i>
                          {post.readTime} min
                        </span>
                      </div>
                      <h4 className="Head_5">{post.title}</h4>
                      <p className="Pra_1">{post.summary}</p>
                      <button 
                        className="ReadMoreBtn"
                        onClick={() => handleReadMore(post.slug)}
                      >
                        Read More
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="BlogPagination">
              <nav aria-label="Blog pagination">
                <div className="pagination-wrapper">
                  <button
                    className={`pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left me-2"></i>
                    Previous
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    className={`pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <i className="fas fa-chevron-right ms-2"></i>
                  </button>
                </div>
              </nav>
            </div>
          )}

          {/* No Results Message */}
          {currentPosts.length === 0 && (
            <div className="NoResults">
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x mb-3" style={{color: '#ff9900'}}></i>
                <h4 className="Head_4 mb-3">No articles found</h4>
                <p className="Pra_1 mb-4">Try selecting a different category or check back later for new content.</p>
                <button 
                  className="BtnBorder"
                  onClick={() => handleCategoryChange("all")}
                >
                  View All Articles
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog; 