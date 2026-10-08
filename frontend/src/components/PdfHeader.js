function PdfHeader({ formId }) {
  return (
    <div className="pdf-header">
      <h1>Website Hosting Requisition Form</h1>
      <h2>For Hosting Website / Portal / Applications at State Data Centre</h2>
      <h3>Department of Information Technology &amp; Communication</h3>
      {formId && <p>Form ID: {formId}</p>}
    </div>
  );
}

export default PdfHeader;