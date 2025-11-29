import { Link } from "react-router-dom";
import "./App.css";
import { blogData } from "./Demo_data";
import "bootstrap/dist/css/bootstrap.css";
function App() {
  let allData = blogData.map((v, i) => {
    return (
      <div className="container mt-4 rounded bg-secondary p-3" key={i}>
        <h3>{v.title}</h3>
        <p>{v.content}</p>
        <Link to={`/blog/${v.id}`} className="btn btn-primary ">
          Read More
        </Link>
      </div>
    );
  });
  return (
    <>
      <div className="container mb-5">
        <h1>Blog</h1>
        {allData}
      </div>
    </>
  );
}

export default App;
