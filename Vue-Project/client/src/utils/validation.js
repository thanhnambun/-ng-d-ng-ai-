// Validation utilities để tái sử dụng trong toàn bộ ứng dụng

export const validationRules = {
  // Kiểm tra required field
  required: (value, fieldName = 'Trường này') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} không được để trống`;
    }
    return null;
  },

  // Kiểm tra email format
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email không đúng định dạng';
    }
    return null;
  },

  // Kiểm tra độ dài tối thiểu
  minLength: (value, minLen, fieldName = 'Trường này') => {
    if (!value) return null;
    if (value.length < minLen) {
      return `${fieldName} phải có ít nhất ${minLen} ký tự`;
    }
    return null;
  },

  // Kiểm tra độ dài tối đa
  maxLength: (value, maxLen, fieldName = 'Trường này') => {
    if (!value) return null;
    if (value.length > maxLen) {
      return `${fieldName} không được vượt quá ${maxLen} ký tự`;
    }
    return null;
  },

  // Kiểm tra password strength
  password: (value) => {
    if (!value) return null;
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
  },

  // Kiểm tra confirm password
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Vui lòng xác nhận mật khẩu';
    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return null;
  },

  // Kiểm tra số
  number: (value, fieldName = 'Trường này') => {
    if (!value) return null;
    if (isNaN(Number(value))) {
      return `${fieldName} phải là số`;
    }
    return null;
  },

  // Kiểm tra số nguyên dương
  positiveInteger: (value, fieldName = 'Trường này') => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
      return `${fieldName} phải là số nguyên dương`;
    }
    return null;
  },

  // Kiểm tra URL
  url: (value, fieldName = 'URL') => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return `${fieldName} không đúng định dạng`;
    }
  },
};

// Form validator class
export class FormValidator {
  constructor() {
    this.errors = {};
  }

  // Validate một field duy nhất
  validateField(fieldName, value, rules) {
    this.errors[fieldName] = null;
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        this.errors[fieldName] = error;
        break;
      }
    }
    
    return !this.errors[fieldName];
  }

  // Validate toàn bộ form
  validateForm(formData, validationSchema) {
    this.errors = {};
    let isValid = true;

    for (const [fieldName, rules] of Object.entries(validationSchema)) {
      const fieldValue = formData[fieldName];
      const fieldValid = this.validateField(fieldName, fieldValue, rules);
      if (!fieldValid) {
        isValid = false;
      }
    }

    return isValid;
  }

  // Lấy lỗi của một field
  getFieldError(fieldName) {
    return this.errors[fieldName];
  }

  // Lấy tất cả lỗi
  getAllErrors() {
    return this.errors;
  }

  // Kiểm tra form có lỗi không
  hasErrors() {
    return Object.values(this.errors).some(error => error !== null);
  }

  // Clear lỗi
  clearErrors() {
    this.errors = {};
  }

  // Clear lỗi của một field
  clearFieldError(fieldName) {
    this.errors[fieldName] = null;
  }
}

// Pre-defined validation schemas cho các form thường dùng
export const validationSchemas = {
  // Schema cho đăng nhập
  login: {
    email: [
      (value) => validationRules.required(value, 'Email'),
      validationRules.email,
    ],
    password: [
      (value) => validationRules.required(value, 'Mật khẩu'),
    ],
  },

  // Schema cho đăng ký
  register: {
    email: [
      (value) => validationRules.required(value, 'Email'),
      validationRules.email,
    ],
    password: [
      (value) => validationRules.required(value, 'Mật khẩu'),
      validationRules.password,
    ],
    confirmPassword: [], // Sẽ được validate riêng với password
    fullName: [
      (value) => validationRules.required(value, 'Họ tên'),
      (value) => validationRules.minLength(value, 2, 'Họ tên'),
    ],
  },

  // Schema cho course
  course: {
    name: [
      (value) => validationRules.required(value, 'Tên khóa học'),
      (value) => validationRules.minLength(value, 3, 'Tên khóa học'),
      (value) => validationRules.maxLength(value, 100, 'Tên khóa học'),
    ],
    description: [
      (value) => validationRules.maxLength(value, 500, 'Mô tả'),
    ],
  },

  // Schema cho subject
  subject: {
    name: [
      (value) => validationRules.required(value, 'Tên môn học'),
      (value) => validationRules.minLength(value, 3, 'Tên môn học'),
      (value) => validationRules.maxLength(value, 100, 'Tên môn học'),
    ],
    idCourse: [
      (value) => validationRules.required(value, 'Khóa học'),
    ],
  },

  // Schema cho exam
  exam: {
    name: [
      (value) => validationRules.required(value, 'Tên bài thi'),
      (value) => validationRules.minLength(value, 3, 'Tên bài thi'),
      (value) => validationRules.maxLength(value, 100, 'Tên bài thi'),
    ],
    time: [
      (value) => validationRules.required(value, 'Thời gian làm bài'),
      (value) => validationRules.positiveInteger(value, 'Thời gian làm bài'),
    ],
    idSubject: [
      (value) => validationRules.required(value, 'Môn học'),
    ],
  },

  // Schema cho question
  question: {
    text: [
      (value) => validationRules.required(value, 'Câu hỏi'),
      (value) => validationRules.minLength(value, 10, 'Câu hỏi'),
    ],
    idExam: [
      (value) => validationRules.required(value, 'Bài thi'),
    ],
  },
};

// Utility function để validate answer list của question
export const validateAnswerList = (answerList, selectedAnswer) => {
  const errors = {};

  // Kiểm tra tất cả câu trả lời đã được điền
  if (answerList.some(answer => !answer.answer || !answer.answer.trim())) {
    errors.answerList = 'Tất cả câu trả lời phải được điền';
  }

  // Kiểm tra đã chọn đáp án đúng
  if (selectedAnswer === null || selectedAnswer === undefined) {
    errors.correctAnswer = 'Phải chọn một câu trả lời đúng';
  }

  // Kiểm tra có đúng 4 câu trả lời
  if (answerList.length !== 4) {
    errors.answerCount = 'Phải có đúng 4 câu trả lời';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validationRules,
  FormValidator,
  validationSchemas,
  validateAnswerList,
};
