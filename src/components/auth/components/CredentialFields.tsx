import { Input } from "@/components/ui/input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthFormData } from "../types";

interface CredentialFieldsProps {
  isLogin: boolean;
  formData: AuthFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CredentialFields = ({ isLogin, formData, handleInputChange }: CredentialFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {!isLogin && (
          <>
            <PasswordStrength password={formData.password} />
            <Alert className="mt-2">
              <AlertDescription>
                Password must:
                <ul className="list-disc pl-4 mt-2 text-sm">
                  <li>Be at least 8 characters long</li>
                  <li>Contain at least one uppercase letter</li>
                  <li>Contain at least one number</li>
                  <li>Contain at least one special character</li>
                </ul>
              </AlertDescription>
            </Alert>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </>
        )}
      </div>
    </>
  );
};