import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SignatureCanvas from 'react-signature-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  ArrowLeft,
  Upload,
  FileText,
  Pen,
  Save,
  RotateCcw,
  Download,
} from 'lucide-react';
import ReceptionService from '@/services/reception.service';
import { toast } from 'sonner';

interface ConsentFormData {
  patientId: string;
  patientName: string;
  file?: FileList;
}

const consentSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  file: z.any().optional(),
});

const ConsentForm: React.FC = () => {
  const navigate = useNavigate();
  const signatureRef = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string>('');

  const form = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: { patientId: '', patientName: '' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      setUploadedFile(file);
      form.setValue('file', e.target.files!);
      toast.success('File uploaded successfully');
    } else {
      toast.error('Please upload a PDF or image');
      e.target.value = '';
    }
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setSignatureData('');
  };

  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const data = signatureRef.current.getTrimmedCanvas().toDataURL();
      setSignatureData(data);
      toast.success('Signature captured');
    }
  };

  const onSubmit = async (data: ConsentFormData) => {
    if (!uploadedFile && !signatureData) {
      toast.error('Attach a file or draw a signature');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('patientId', data.patientId);
      formData.append('patientName', data.patientName);
      if (uploadedFile) formData.append('file', uploadedFile);
      if (signatureData) formData.append('signature', signatureData);

      const result = await ReceptionService.uploadConsent(formData);
      toast.success('Saved!', { description: `Consent for ${result.patientName}` });

      // reset
      form.reset();
      setUploadedFile(null);
      clearSignature();
      fileInputRef.current!.value = '';
      setSignatureData('');

      navigate('/reception');
    } catch (err) {
      console.error(err);
      toast.error('Save failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/reception')}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Consent Form</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Patient + File */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText className="inline-block mr-2" /> Patient Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient ID *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter patient ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Upload className="inline-block mr-2" /> Upload Consent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed p-6 text-center hover:border-gray-400 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={48} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">Click or drag to upload</p>
                  <p className="text-xs text-gray-500">PDF or image files</p>
                </label>
              </div>
              {uploadedFile && (
                <div className="flex items-center justify-between p-3 bg-green-50 border rounded">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-green-600" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-green-700">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setUploadedFile(null);
                      form.setValue('file', undefined);
                      fileInputRef.current!.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Signature & Save */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Pen className="inline-block mr-2" /> Digital Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border p-2 bg-white">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{ className: 'w-full h-48' }}
                  backgroundColor="#FFF"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Sign above with mouse or touch
                </p>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearSignature}
                  >
                    <RotateCcw className="mr-1" /> Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={saveSignature}
                    disabled={signatureRef.current?.isEmpty()}
                  >
                    <Save className="mr-1" /> Save
                  </Button>
                </div>
              </div>

              {signatureData && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border rounded">
                  <div className="flex items-center space-x-2">
                    <Pen className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Signature captured
                    </span>
                  </div>
                  <a
                    href={signatureData}
                    download={`signature-${form.getValues('patientId') || 'patient'}.png`}
                  >
                    <Button size="sm" variant="outline">
                      <Download className="mr-1" /> Download
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save Consent Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Ensure patient info is correct and you have either uploaded a file or saved a signature.
              </p>
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate('/reception')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving…'
                    : (
                      <>
                        <Save className="mr-1" /> Save
                      </>
                    )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
