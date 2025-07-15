import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Loader from "../components/loader";
import { blogPosts } from "../../utils/blogData";
import { getBlogContent } from "../../utils/blogContent";

const BlogDetail = () => {
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState(0);
  const [selectedSection, setSelectedSection] = useState('all'); // 'all' shows complete content

  // Find the current post
  const currentPost = blogPosts.find(post => post.slug === slug);
  
  // Get latest posts for sidebar (excluding current post)
  const latestPosts = blogPosts
    .filter(post => post.id !== currentPost?.id)
    .slice(0, 5);

  useEffect(() => {
    if (!currentPost) {
      navigate("/blog");
      return;
    }

    document.title = `${currentPost.title} - TAK8 Car Rental Blog`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", currentPost.summary);
    }
    
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "instant" });
    
    setTimeout(() => setLoading(false), 500);

    // Reading progress tracking
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial progress

    // Set up intersection observer for table of contents
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Get the first visible heading
          const firstVisible = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current;
          });
          // Section tracking for future use if needed
        }
      },
      { 
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.5, 1.0]
      }
    );

    // Observe all heading elements after content loads
    setTimeout(() => {
      const headings = document.querySelectorAll('.BlogContent h2[id], .BlogContent h3[id]');
      headings.forEach(heading => observer.observe(heading));
    }, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPost, navigate, slug]);

  // Comprehensive anchor navigation hook
  const useAnchorNavigation = () => {
    useEffect(() => {
      const scrollToElement = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80; // Adjust based on your header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };

      // Handle click events on anchor links
      const handleAnchorClick = (e) => {
        const target = e.target.closest('a');
        if (target && target.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          const targetId = target.getAttribute('href').substring(1);
          
                  // Update URL hash without triggering page scroll
        window.history.replaceState(null, null, `#${targetId}`);
          
          // Scroll to element
          scrollToElement(targetId);
        }
      };

      // Handle URL hash changes
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
          setTimeout(() => scrollToElement(hash), 100);
        }
      };

      // Handle initial load with hash
      if (window.location.hash) {
        setTimeout(() => handleHashChange(), 100);
      }

      // Add event listeners
      document.addEventListener('click', handleAnchorClick);
      window.addEventListener('hashchange', handleHashChange);
      
      return () => {
        document.removeEventListener('click', handleAnchorClick);
        window.removeEventListener('hashchange', handleHashChange);
      };
    }, []);
  };

  // Use the hook in your component
  useAnchorNavigation();

  const handleBackToList = () => {
    sessionStorage.setItem('shouldRestoreScroll', 'true');
    navigate("/blog");
  };

  const handlePostClick = (postSlug) => {
    sessionStorage.removeItem('blogListScrollPosition');
    sessionStorage.removeItem('shouldRestoreScroll');
    navigate(`/blog/${postSlug}`);
  };

  // Generate table of contents from full content
  const generateTableOfContents = () => {
    const content = getFullContent(currentPost);
    const headings = content.match(/<h[23][^>]*>([^<]*)<\/h[23]>/gi) || [];
    
    return headings.map((heading, index) => {
      const level = heading.match(/<h([23])/)[1];
      const text = heading.replace(/<[^>]*>/g, '').trim();
      const id = text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-|-$/g, '');
      
      return {
        id,
        text,
        level: parseInt(level),
        index: index + 1
      };
    });
  };

  // Add IDs to headings in the content
  const addIdsToContent = (content) => {
    if (!content) return '';
    
    // Remove the first image (main image) from content since we display it separately
    let processedContent = content.replace(/(<div class="blog-content-wrapper">\s*)<img[^>]*>/, '$1');
    
    // Replace h2 and h3 tags to include IDs
    return processedContent.replace(/<h([23])([^>]*)>([^<]*)<\/h[23]>/gi, (match, level, attrs, text) => {
      const cleanText = text.trim();
      const id = cleanText.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-|-$/g, '');
      
      return `<h${level}${attrs} id="${id}">${cleanText}</h${level}>`;
    });
  };

  // Extract specific section content
  const extractSectionContent = (content, sectionId) => {
    if (!content || selectedSection === 'all') return addIdsToContent(content);
    
    // Extract content from inside the blog-content-wrapper
    const wrapperMatch = content.match(/<div class="blog-content-wrapper">([\s\S]*)<\/div>/);
    const innerContent = wrapperMatch ? wrapperMatch[1] : content;
    
    // Split content by h2 headings only (main sections)
    const sections = innerContent.split(/(<h2[^>]*>.*?<\/h2>)/gi);
    let sectionContent = '';
    let capturing = false;
    let targetSectionFound = false;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      // Check if this is an h2 heading (main section)
      const h2HeadingMatch = section.match(/<h2[^>]*>([^<]*)<\/h2>/gi);
      if (h2HeadingMatch) {
        const text = section.replace(/<[^>]*>/g, '').trim();
        const id = text.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-|-$/g, '');
        
        if (id === sectionId) {
          capturing = true;
          targetSectionFound = true;
          sectionContent += section;
        } else if (capturing && targetSectionFound) {
          // Stop capturing when we hit the next h2 heading (main section)
          break;
        }
      } else if (capturing) {
        // Add all content (including h3 sub-headings and their content) until next h2
        sectionContent += section;
      }
    }
    
    // If no h2 section found, check if it's an h3 sub-section
    if (!targetSectionFound) {
      // Find the parent h2 section that contains this h3
      const allSections = innerContent.split(/(<h[23][^>]*>.*?<\/h[23]>)/gi);
      let foundTargetH3 = false;
      let currentH2Content = '';
      
      for (let i = 0; i < allSections.length; i++) {
        const section = allSections[i];
        
        // Check if this is an h2 heading
        const h2Match = section.match(/<h2[^>]*>([^<]*)<\/h2>/gi);
        if (h2Match) {
          // If we found our target h3 in the previous h2 section, stop here
          if (foundTargetH3) {
            break;
          }
          // Start new h2 section
          currentH2Content = section;
        } else {
          // Check if this is an h3 heading
          const h3Match = section.match(/<h3[^>]*>([^<]*)<\/h3>/gi);
          if (h3Match) {
            const text = section.replace(/<[^>]*>/g, '').trim();
            const id = text.toLowerCase()
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, '-')
              .replace(/^-|-$/g, '');
            
            if (id === sectionId) {
              foundTargetH3 = true;
              // Include the parent h2 and everything up to this h3
              sectionContent = currentH2Content + section;
            } else if (foundTargetH3) {
              // Stop when we hit the next h3
              break;
            }
          } else if (foundTargetH3) {
            // Add content after our target h3
            sectionContent += section;
          } else {
            // Add content to current h2 section
            currentH2Content += section;
          }
        }
      }
    }
    
    // Wrap the extracted content back in the blog-content-wrapper to preserve styling
    const finalContent = sectionContent.trim() ? 
      `<div class="blog-content-wrapper">${sectionContent}</div>` : 
      addIdsToContent(content);
    
    // Apply IDs to all headings in the final content
    return addIdsToContent(finalContent);
  };

  const handleSectionClick = (id) => {
    setSelectedSection(id);
    
    // Scroll to the content area instead of top
    setTimeout(() => {
      const contentElement = document.querySelector('.BlogContent');
      if (contentElement) {
        const offset = contentElement.offsetTop - 100; // 100px offset for better positioning
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const showAllContent = () => {
    setSelectedSection('all');
    
    // Scroll to the content area instead of top
    setTimeout(() => {
      const contentElement = document.querySelector('.BlogContent');
      if (contentElement) {
        const offset = contentElement.offsetTop - 100;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 100);
  };





  // Simplified content function to avoid parsing issues
  const getFullContent = (post) => {
    if (!post) return '';
    const contentData = getBlogContent(post.slug);
    return contentData.content;
  };

  // Removed old content function to fix compilation errors

  if (loading) {
    return <Loader />;
  }

  if (!currentPost) {
    return null;
  }

  const tableOfContents = generateTableOfContents();

  return (
    <>
      <Header />
      
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress" 
        style={{ width: `${readingProgress}%` }}
      ></div>

      <section className="BlogDetailSection">
        <div className="container">
          
          {/* Back to Blog Button */}
          <div className="BackToBlog">
            <button onClick={handleBackToList}>
              <i className="fas fa-arrow-left"></i>
              Back to Blog
            </button>
          </div>

          {/* Main Blog Image */}
          <div className="BlogMainImage">
            <img src={currentPost.image} alt={currentPost.title} />
            <div className="CategoryBadge">{currentPost.category}</div>
          </div>

          {/* Blog Header */}
          <div className="BlogDetailHeader">
            <h1>{currentPost.title}</h1>
            
            <div className="BlogMeta">
              <div className="meta-item">
                <i className="fas fa-calendar"></i>
                <span>{currentPost.date}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>{currentPost.readTime} min read</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-user"></i>
                <span>TAK8 Team</span>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="BlogContent">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: extractSectionContent(getFullContent(currentPost), selectedSection)
                  }} 
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="blog-sidebar-container">
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <div className="TableOfContents">
                    <h4>
                      <i className="fas fa-list"></i>
                      Table of Contents
                    </h4>
                    
                    <ul>
                      {tableOfContents.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSectionClick(item.id);
                            }}
                            className={selectedSection === item.id ? 'active' : ''}
                            style={{
                              paddingLeft: item.level === 3 ? '20px' : '0px'
                            }}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Latest Blogs */}
                <div className="LatestBlogs">
                  <h4>
                    <i className="fas fa-newspaper"></i>
                    Latest Articles
                  </h4>
                  
                  {latestPosts.map((post) => (
                    <div 
                      key={post.id}
                      className="LatestBlogItem"
                      onClick={() => handlePostClick(post.slug)}
                    >
                      <div className="LatestBlogImage">
                        <img src={post.image} alt={post.title} />
                      </div>
                      <div className="LatestBlogContent">
                        <div className="LatestBlogMeta">
                          <span className="CategoryBadge small">{post.category}</span>
                          <span className="ReadTime">
                            <i className="fas fa-clock"></i>
                            {post.readTime} min
                          </span>
                        </div>
                        <h6>{post.title}</h6>
                        <p className="BlogDate">
                          <i className="fas fa-calendar"></i>
                          {post.date}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="ViewAllBlogs">
                    <button 
                      className="BtnBorder"
                      onClick={() => navigate('/blog')}
                    >
                      View All Articles
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogDetail; 