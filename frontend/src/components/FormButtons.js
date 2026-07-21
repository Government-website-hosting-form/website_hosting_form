function FormButtons({ showBack, onBack, onNext, disabled, saving, onNextLabel }) {

    return (

        <div className="button-group">

            {showBack && (

                <button
                    type="button"
                    className="back-btn"
                    onClick={onBack}
                    disabled={disabled}
                >
                    Back
                </button>

            )}

            <button
                type="button"
                className="next-btn"
                onClick={onNext}
                disabled={disabled}
            >
                {saving ? "Saving..." : (onNextLabel || "Save & Next")}
            </button>

        </div>

    );

}

export default FormButtons;
