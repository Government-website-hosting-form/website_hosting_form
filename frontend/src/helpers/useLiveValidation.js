import { useState } from "react";


export default function useLiveValidation(getErrors) {
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allErrors = getErrors();

  const errors = {};
  for (const [field, message] of Object.entries(allErrors)) {
    if (message && (submitted || touched[field])) errors[field] = message;
  }

  function touch(name) {
    if (!name) return;
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }

  function handleBlur(e) {
    const name = e && e.target && e.target.name;
    if (name) touch(name);
  }

  function validateAll() {
    setSubmitted(true);
    return Object.keys(allErrors).length === 0;
  }

  return { errors, touch, handleBlur, validateAll };
}