function FormButtons({ onNext }) {
  return (
    <div className="button-group">
      <button
        type="button"
        className="next-btn"
        onClick={onNext}
      >
        Save & Next
      </button>
    </div>
  );
}

export default FormButtons;