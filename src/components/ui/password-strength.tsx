import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const getStrengthWidth = () => {
    if (!password) return "0%";
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return `${(strength / 4) * 100}%`;
  };

  const getStrengthColor = () => {
    const width = parseInt(getStrengthWidth());
    if (width <= 25) return "bg-red-500";
    if (width <= 50) return "bg-orange-500";
    if (width <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={cn("h-full transition-all duration-300", getStrengthColor())}
        style={{ width: getStrengthWidth() }}
      />
    </div>
  );
};