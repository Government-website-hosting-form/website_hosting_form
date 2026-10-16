import { useEffect, useRef } from "react";
import { useFormContext } from "../context/FormContext";

// A form page calls useLeaveSave(saveFn). While that page is open, the Home
// button can run saveFn (without validation) when the user picks "Save & go to Home".
export default function useLeaveSave(saveFn) {
  const { setLeaveSaver } = useFormContext();
  const saveRef = useRef(saveFn);
  saveRef.current = saveFn; // always the latest version (latest form values)

  useEffect(() => {
    setLeaveSaver(() => saveRef.current());
    return () => setLeaveSaver(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}