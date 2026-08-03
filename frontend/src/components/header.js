function Header() {
  return (
    <div className="header">
      <div className="header-top">
        <button className="header-btn" onClick={() => { /* logic here */ }}>
          Back to SSO
        </button>
        <button className="header-btn" onClick={() => { /* logic here */ }}>
          Logout
        </button>
      </div>

      <h1>Website Hosting Requisition Form</h1>
      <p>For Hosting Website / Portal / Applications at State Data Centre</p>
      <p>Department of Information Technology & Communication</p>
    </div>
  );
}

export default Header;