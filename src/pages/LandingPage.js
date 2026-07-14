import Header from "../components/Header";
import StartButton from "../components/StartButton";
import Note from "../components/Note";

function LandingPage() {
  return (
    <div className="container">
      <Header />
      <StartButton />
      <Note />
    </div>
  );
}

export default LandingPage;