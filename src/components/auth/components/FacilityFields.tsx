import { Input } from "@/components/ui/input";
import { AuthFormData } from "../types";

interface FacilityFieldsProps {
  formData: AuthFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FacilityFields = ({ formData, handleInputChange }: FacilityFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          name="facilityName"
          placeholder="Facility Name"
          value={formData.facilityName}
          onChange={handleInputChange}
          required
        />
      </div>
    </>
  );
};