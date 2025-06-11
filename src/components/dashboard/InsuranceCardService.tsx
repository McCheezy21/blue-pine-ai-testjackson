import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Search, Calendar, Sparkles, Shield, FileImage } from "lucide-react";

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
        <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patientId" className="text-slate-700 font-medium">Patient ID *</Label>
        <Input
          id="patientId"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-medium">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dob" className="text-slate-700 font-medium">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facilityName" className="text-slate-700 font-medium">Facility Name *</Label>
        <Input
          id="facilityName"
          value={formData.facilityName}
          onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Apple-inspired Header */}
      <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
              Insurance Card Services
            </h1>
            <p className="text-slate-600 mt-2">Upload new insurance cards or fetch existing ones from our secure system.</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-100/50">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium text-sm">HIPAA Secure</span>
          </div>
        </div>
      </div>

      {/* Apple-inspired Tabs */}
      <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-1 mb-8">
            <TabsTrigger 
              value="upload" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 transition-all duration-300"
            >
              <Upload className="h-4 w-4" />
              Upload Card
            </TabsTrigger>
            <TabsTrigger 
              value="fetch" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 transition-all duration-300"
            >
              <Search className="h-4 w-4" />
              Fetch Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/30 via-white to-blue-50/20 backdrop-blur-sm border border-slate-200/50 rounded-2xl">
              {/* Floating background elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-slate-400/10 to-slate-200/10 rounded-full blur-2xl"></div>
              
              <div className="relative p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Upload Insurance Card</h3>
                    <p className="text-slate-600">Upload a patient's insurance card image to our secure storage.</p>
                  </div>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  <FormFields formData={uploadForm} setFormData={setUploadForm} />
                  
                  <div className="space-y-3">
                    <Label htmlFor="file" className="text-slate-700 font-medium">Insurance Card Image *</Label>
                    <div className="relative">
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium"
                        required
                      />
                      <FileImage className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                    {uploadFile && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl border border-green-200/50">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-green-700 font-medium">Selected: {uploadFile.name}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <Upload className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Upload Insurance Card</span>
                  </button>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fetch">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20 backdrop-blur-sm border border-slate-200/50 rounded-2xl">
              {/* Floating background elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-emerald-300/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-slate-400/10 to-slate-200/10 rounded-full blur-2xl"></div>
              
              <div className="relative p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Fetch Insurance Card</h3>
                    <p className="text-slate-600">Retrieve an existing insurance card using patient information.</p>
                  </div>
                </div>

                <form onSubmit={handleFetchSubmit} className="space-y-6">
                  <FormFields formData={fetchForm} setFormData={setFetchForm} />

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Fetch Insurance Card</span>
                  </button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
