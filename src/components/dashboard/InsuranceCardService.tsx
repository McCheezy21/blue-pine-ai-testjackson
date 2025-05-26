
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Search, Calendar } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patientId">Patient ID *</Label>
        <Input
          id="patientId"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facilityName">Facility Name *</Label>
        <Input
          id="facilityName"
          value={formData.facilityName}
          onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Card Services</h1>
        <p className="text-gray-600">Upload new insurance cards or fetch existing ones from our system.</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Card
          </TabsTrigger>
          <TabsTrigger value="fetch" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Fetch Card
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Insurance Card</CardTitle>
              <p className="text-gray-600">Upload a patient's insurance card image to our secure S3 storage.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <FormFields formData={uploadForm} setFormData={setUploadForm} />
                
                <div className="space-y-2">
                  <Label htmlFor="file">Insurance Card Image *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    required
                  />
                  {uploadFile && (
                    <p className="text-sm text-gray-600">Selected: {uploadFile.name}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Insurance Card
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fetch">
          <Card>
            <CardHeader>
              <CardTitle>Fetch Insurance Card</CardTitle>
              <p className="text-gray-600">Retrieve an existing insurance card using patient information.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFetchSubmit} className="space-y-6">
                <FormFields formData={fetchForm} setFormData={setFetchForm} />

                <Button type="submit" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Fetch Insurance Card
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
