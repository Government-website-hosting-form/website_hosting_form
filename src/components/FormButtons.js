function FormButtons(props) {

  return (

    <div className="button-group">

      {props.showBack && (
        <button
          className="back-btn"
          onClick={props.onBack}
        >
          Back
        </button>
      )}

      <button
        className="next-btn"
        onClick={props.onNext}
      >
        Save & Next
      </button>

    </div>

  );

}

export default FormButtons;