import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Search, Calendar, Shield, FileImage, CheckCircle } from "lucide-react";

export const InsuranceCardService = () => {
  const [uploadForm, setUploadForm] = useState({
    firstName: "",
    lastName: "",
    patientId: "",
    email: "",
    dob: "",
    facilityName: ""
  });

  const [fetchForm, setFetchForm] = useState({
    firstName: "",
    lastName: "",
    patientId: "",
    email: "",
    dob: "",
    facilityName: ""
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Upload form submitted:", uploadForm, uploadFile);
    // TODO: Implement S3 upload logic
  };

  const handleFetchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Fetch form submitted:", fetchForm);
    // TODO: Implement fetch logic
  };

  const FormFields = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-[#333333] font-medium">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="border-[#CCCCCC] focus:border-[#004466] focus:ring-[#004466]/20 rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-[#333333] font-medium">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="border-[#CCCCCC] focus:border-[#004466] focus:ring-[#004466]/20 rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patientId" className="text-[#333333] font-medium">Patient ID *</Label>
        <Input
          id="patientId"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          className="border-[#CCCCCC] focus:border-[#004466] focus:ring-[#004466]/20 rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#333333] font-medium">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border-[#CCCCCC] focus:border-[#004466] focus:ring-[#004466]/20 rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dob" className="text-[#333333] font-medium">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className="border-[#CCCCCC] focus:border-[#004466] focus:ring-[#004466]/20 rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facilityName" className="text-[#333333] font-medium">Facility Name *</Label>
        <Input
          id="facilityName"
          value={formData.facilityName}
          onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
          className="border-[#CCCCCC] focus:border-[#004466] focus:ring-[#004466]/20 rounded-lg"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 font-['Inter',system-ui,sans-serif]">
      {/* Healthcare Header */}
      <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#333333] mb-2">
              Insurance Card Services
            </h1>
            <p className="text-[#333333]/70">Upload new insurance cards or fetch existing ones from our secure system.</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-[#3CB371]/10 rounded-lg border border-[#3CB371]/20">
            <Shield className="w-4 h-4 text-[#3CB371]" />
            <span className="text-[#333333] font-medium text-sm">HIPAA Secure</span>
          </div>
        </div>
      </div>

      {/* Clean Tabs */}
      <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-[#CCCCCC] rounded-lg p-1 mb-8">
            <TabsTrigger 
              value="upload" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-[#004466] data-[state=active]:text-white transition-all duration-200"
            >
              <Upload className="h-4 w-4" />
              Upload Card
            </TabsTrigger>
            <TabsTrigger 
              value="fetch" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-[#004466] data-[state=active]:text-white transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              Fetch Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="bg-white border border-[#CCCCCC] rounded-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-[#004466] rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#333333]">Upload Insurance Card</h3>
                  <p className="text-[#333333]/70">Upload a patient's insurance card image to our secure storage.</p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <FormFields formData={uploadForm} setFormData={setUploadForm} />
                
                <div className="space-y-3">
                  <Label htmlFor="file" className="text-[#333333] font-medium">Insurance Card Image *</Label>
                  <div className="relative">
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="border-[#CCCCCC] focus:border-[#004466] focus:ring-[#004466]/20 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#EAEFF2] file:text-[#004466] file:font-medium"
                      required
                    />
                    <FileImage className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#333333]/40" />
                  </div>
                  {uploadFile && (
                    <div className="flex items-center space-x-2 p-3 bg-[#3CB371]/10 rounded-lg border border-[#3CB371]/20">
                      <CheckCircle className="h-4 w-4 text-[#3CB371]" />
                      <p className="text-sm text-[#333333] font-medium">Selected: {uploadFile.name}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#004466] text-white font-medium rounded-lg hover:bg-[#005580] transition-colors duration-200"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Insurance Card</span>
                </button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="fetch">
            <div className="bg-white border border-[#CCCCCC] rounded-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-[#004466] rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#333333]">Fetch Insurance Card</h3>
                  <p className="text-[#333333]/70">Retrieve an existing insurance card from our secure database.</p>
                </div>
              </div>

              <form onSubmit={handleFetchSubmit} className="space-y-6">
                <FormFields formData={fetchForm} setFormData={setFetchForm} />

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#004466] text-white font-medium rounded-lg hover:bg-[#005580] transition-colors duration-200"
                >
                  <Search className="h-4 w-4" />
                  <span>Fetch Insurance Card</span>
                </button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
