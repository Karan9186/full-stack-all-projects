import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { blogData } from "./assets/datas";
import { Link } from "react-router-dom";

function App() {
  let allData = blogData.map((v, i) => {
    return (
      <div
        className="container pt-4 bg-secondary mt-3 pb-3 text-light rounded"
        key={i}
      >
        <h3>{v.title}</h3>

        <p>{v.content}</p>

        <Link
          to={`/blog/${v.id}`}
          className="text-white text-decoration-none btn btn-primary"
        >
          show more
        </Link>
      </div>
    );
  });
  return (
    <>
      <h1 className="container pt-5">
        this is the main App Componenet in React Js
      </h1>
      <div>{allData}</div>
      <br />
      <br />
      <br />
    </>
  );
}

export default App;
