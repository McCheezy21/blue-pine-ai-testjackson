export interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  facilityName?: string;
}