function FormButtons({ showBack, onBack, onNext }) {

    return (

        <div className="button-group">

            {showBack && (

                <button
                    type="button"
                    className="back-btn"
                    onClick={onBack}
                >
                    Back
                </button>

            )}

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