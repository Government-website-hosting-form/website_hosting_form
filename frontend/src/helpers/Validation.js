export function validateText(value, maxLength) {
  if (/\d/.test(value)) {
    return "Numbers are not allowed.";
  }

  if (value.trim().length > maxLength) {
    return `Maximum ${maxLength} characters allowed.`;
  }

  return "";
}

export function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !pattern.test(email)) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validateMobile(mobile) {
  if (mobile && !/^\d+$/.test(mobile)) {
    return "Only numbers are allowed.";
  }

  if (mobile && !/^\d{10}$/.test(mobile)) {
    return "Mobile number must be exactly 10 digits.";
  }

  return "";
}

export function validatePhone(phone) {
  if (phone && !/^\d+$/.test(phone)) {
    return "Only numbers are allowed.";
  }

  if (phone && !/^\d{6,15}$/.test(phone)) {
    return "Enter a valid phone number.";
  }

  return "";
}

export function validateFileType(file, allowedTypes) {
  if (file && !allowedTypes.includes(file.type)) {
    return "Invalid file type.";
  }

  return "";
}

export function validateFileSize(file, maxSize) {
  if (file && file.size > maxSize) {
    return "File size exceeds the allowed limit.";
  }

  return "";
}

export function validateNumber(value) {
  if (!/^\d+$/.test(value)) {
    return "Only numbers are allowed.";
  }
  return "";
}