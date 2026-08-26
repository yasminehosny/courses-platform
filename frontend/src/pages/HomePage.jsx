import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, getCategories, getImageUrl } from "../services/api";

import {
  FaSearch,
  FaTimes,
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaGraduationCap,
  FaClock,
  FaTrophy,
  FaComments,
  FaRocket,
} from "react-icons/fa";
import { MdOutlinePlayLesson } from "react-icons/md";

import { FaChalkboardUser } from "react-icons/fa6";

const LIMIT = 3;
const getBg = (id) => ['#1a1528','#0d1a28','#1a1208','#1a0d0d','#081a1a'][(id||'').charCodeAt(0)%5];


const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

export default function HomePage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [cats, setCats] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchErr, setSearchErr] = useState("");

  useEffect(() => {
    getCategories()
      .then((d) => setCats(d.categories || []))
      .catch(() => {});
    loadCourses("", "", 1);
  }, []);

  const loadCourses = async (q = "", cat = "", p = 1, minP = "", maxP = "") => {
    setLoading(true);
    try {
      const params = { page: p, limit: LIMIT };
      if (q) params.search = q;
      if (cat) params.categoryID = cat;
      if (minP) params.minPrice = minP;
      if (maxP) params.maxPrice = maxP;
      const d = await getCourses(params);
      setCourses(d.courses || []);
      setTotalPages(d.pagination?.totalPages || 1);
      setTotal(d.pagination?.total || 0);
      setPage(p);
    } catch {
      setCourses([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const normalized = search.trim();
    if (normalized && normalized.length < 2) {
      setSearchErr("Search should be at least 2 characters");
      return;
    }
    setSearchErr("");
    loadCourses(normalized, catFilter, 1, minPrice, maxPrice);
  };

  const handleCat = (id) => {
    setSearchErr("");
    setCatFilter(id);
    loadCourses(search.trim(), id, 1, minPrice, maxPrice);
  };

  const handlePriceFilter = () => {
    setSearchErr("");
    loadCourses(search.trim(), catFilter, 1, minPrice, maxPrice);
  };

  const handlePage = (pageNum) => {
    setSearchErr("");
    loadCourses(search.trim(), catFilter, pageNum, minPrice, maxPrice);
  };

  return (
    <div className="page">
      {/* قسم البطل الرئيسي */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
        borderRadius: 16,
        padding: "60px 40px",
        marginBottom: 60,
        textAlign: "center",
        color: "white",
      }}>
        <h1 className="text-warning" style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, fontFamily: "'Syne', sans-serif" }}>
          Welcome to LearnHub
        </h1>
        <p className="text-muted" style={{ fontSize: 18, marginBottom: 24, opacity: 0.95 }}>
          Your go-to platform for learning from the world's best instructors
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            className="btn bg-warning" 
            style={{ background: "white", color: "var(--primary)", fontWeight: 600 }}
            onClick={() => document.querySelector(".search-wrap input")?.focus()}
          >
            Get Started Now
          </button>
          <button className="btn bg-dark" style={{ borderColor: "white", color: "white" }}>
            Learn More
          </button>
        </div>
      </div>

      
      <div style={{ marginBottom: 60, paddingBottom: 40, borderBottom: "1px solid var(--border)" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 12,
            fontFamily: "'Syne', sans-serif"
          }}>
            Why Choose LearnHub?
          </h2>
          <p style={{ color: "var(--text3)", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
            A modern educational platform offering the best learning experiences with professional instructors
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 24,
          marginBottom: 50
        }}>
          {[
            {
              icon: <FaGraduationCap />,
              title: "Specialized Courses",
              desc: "Thousands of courses across different fields from programming to design and business"
            },
            {
              icon: <FaChalkboardUser />,
              title: "Professional Instructors",
              desc: "Learn from top experts and specialists with years of industry experience"
            },
            {
              icon: <FaClock />,
              title: "Learn at Your Pace",
              desc: "Study anytime, anywhere at your own pace with lifetime access to courses"
            },
            {
              icon: <FaTrophy />,
              title: "Recognized Certificates",
              desc: "Earn certificates of completion that are recognized globally and valued by employers"
            },
            {
              icon: <FaComments />,
              title: "Community & Support",
              desc: "Join a vibrant community of learners and get dedicated support from mentors"
            },
            {
              icon: <FaRocket />,
              title: "Career Growth",
              desc: "Advance your career with job-ready skills and connect with top companies"
            }
          ].map((feature, i) => (
            <div key={i} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
            >
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "center", color: "var(--accent)" }}>
                <span style={{ fontSize: 40 }}>
                  {feature.icon}
                </span>
              </div>
              <h3 style={{ color: "var(--text)", fontWeight: 600, marginBottom: 8 }}>
                {feature.title}
              </h3>
              <p style={{ color: "var(--text3)", fontSize: 14, lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2
          className="syne text-warning text-center"
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 8,
          }}
        >
          Discover Courses
        </h2>
        <p style={{ color: "var(--text3)", fontSize: 16 }} className="text-muted text-center">
          Choose from hundreds of specialized courses across different domains
        </p>
      </div>

        {/* محرك البحث */}
      <form onSubmit={handleSearch} className="search-wrap">
        <div className="search-input-wrap">
          <FaSearch style={{ color: "var(--text3)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses... (e.g. C++, Python, React)"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchErr("");
                loadCourses("", catFilter, 1);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text3)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>
      {searchErr && (
        <div className="alert alert-err" style={{ marginBottom: 14 }}>
          <FaTimes style={{ marginRight: 8 }} /> {searchErr}
        </div>
      )}

      {/* التصفية والبحث */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {/* تصفية حسب الكاتيجوري */}
        <div>
          <label style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 8, display: 'block' }}>
            Category:
          </label>
          <select
            value={catFilter}
            onChange={(e) => handleCat(e.target.value)}
            className="form-control"
            style={{ maxWidth: 250 }}
          >
            <option value="">All Categories</option>
            {cats.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

       
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ fontSize: 14, color: 'var(--text3)', whiteSpace: 'nowrap' }}>Price Range:</label>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ width: 100, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 4 }}
          />
          <span style={{ color: 'var(--text3)' }}>to</span>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: 100, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 4 }}
          />
          <button className="btn btn-outline btn-sm" onClick={handlePriceFilter}>
            Apply
          </button>
        </div>
      </div>

     
      {!loading && (
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
          {total} course{total !== 1 ? "s" : ""} found
          {totalPages > 1 && ` — Page ${page} of ${totalPages}`}
        </p>
      )}

      {/* الكورسات */}
      {loading ? (
        <div className="loader-wrap">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FaBook size={48} /></div>
          <div className="empty-title">No courses found</div>
          <p>Try a different search term or category</p>
        </div>
      ) : (
        <>
          <div className="course-grid">
            {courses.map((c) => (
              <div
                key={c._id}
                className="course-card"
                onClick={() => navigate(`/courses/${c._id}`)}
              >
                <div
                  className="course-img"
                  style={{ background: getBg(c._id) }}
                >
                  {c.imageUrl ? (
                    <img src={getImageUrl(c.imageUrl)} alt={c.title} />
                  ) : (
                    <MdOutlinePlayLesson size={64} color="#f59e0b" />
                  )}
                </div>
                <div className="course-body">
                  {c.categoryID && (
                    <span className="course-cat">{c.categoryID.name}</span>
                  )}
                  <div className="course-title">{c.title}</div>
                  <div className="course-desc">{c.description}</div>
                  <div className="course-foot">
                    <span className="course-price">${c.price}</span>
                    {c.instructorID && (
                      <span className="course-by">
                        by {c.instructorID.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
             
              <button
                className="page-btn"
                onClick={() => handlePage(1)}
                disabled={page === 1}
                title="First page"
              >
                <FaChevronLeft />
                <FaChevronLeft />
              </button>

            
              <button
                className="page-btn"
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                title="Previous page"
              >
                <FaChevronLeft />
              </button>

              
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    style={{
                      padding: "0 4px",
                      color: "var(--text3)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn${page === p ? " active" : ""}`}
                    onClick={() => handlePage(p)}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                className="page-btn"
                onClick={() => handlePage(page + 1)}
                disabled={page === totalPages}
                title="Next page"
              >
                <FaChevronRight />
              </button>

             
              <button
                className="page-btn"
                onClick={() => handlePage(totalPages)}
                disabled={page === totalPages}
                title="Last page"
              >
                <FaChevronRight />
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
