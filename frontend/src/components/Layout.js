import Header from "./header";
import "../styles/Form.css";

function Layout({ children }) {
  return (
    <>
      <Header />

      <div className="page-container">
        <div className="form-card">
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;