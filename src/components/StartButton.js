import { useNavigate } from "react-router-dom";

function StartButton() {

  const navigate = useNavigate();

  function startForm() {
    navigate("/organization");
  }

  return (
    <button
      className="start-button"
      onClick={startForm}
    >
      Fill Website Hosting Form
    </button>
  );
}

export default StartButton;