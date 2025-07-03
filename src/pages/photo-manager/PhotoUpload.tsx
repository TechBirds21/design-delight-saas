import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  X, 
  User,
  Save,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { getPatientDetails } from '@/api/doctor';
import { uploadPatientPhoto } from '@/api/photos';
import { toast } from 'sonner';
import DoctorService from '@/services/doctor.service';
import PhotoService from '@/services/photo.service';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  medicalHistory: string;
  allergies: string;
  lastVisit: string;
  totalVisits: number;
  avatar?: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

const PhotoUpload: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [photoType, setPhotoType] = useState<'before' | 'after' | 'in-progress'>('before');
  const [sessionId, setSessionId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (patientId && patientId !== 'new') {
      loadPatientDetails();
    } else {
      setLoading(false);
    }
    
    // Generate a session ID for this upload session
    setSessionId(`session_${Date.now()}`);
  }, [patientId]);

  const loadPatientDetails = async () => {
    try {
      setLoading(true);
      const patientData = await DoctorService.getPatientDetails(patientId!);
      setPatient(patientData);
    } catch (error) {
      // If patient not found, try to load a default patient as fallback
      try {
        console.warn(`Patient ${patientId} not found, loading default patient`);
        const defaultPatientData = await DoctorService.getPatientDetails('p1');
        setPatient(defaultPatientData);
        toast.warning('Patient not found', {
          description: `Patient ID "${patientId}" not found. Showing default patient for demo purposes.`,
        });
      } catch (fallbackError) {
        toast.error('Failed to load patient details');
        console.error('Error loading patient and fallback:', error, fallbackError);
        navigate('/photo-manager');
      }
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    const filesWithPreview: FileWithPreview[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setSelectedFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    if (!sessionId.trim()) {
      toast.error('Please enter a session ID');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload each file
      const uploadPromises = selectedFiles.map(async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('patientId', patientId === 'new' ? 'p1' : patientId!); // Use p1 as default for demo
        formData.append('type', photoType);
        formData.append('sessionId', sessionId);
        formData.append('notes', notes);
        
        return PhotoService.uploadPatientPhoto(formData);
      });

      await Promise.all(uploadPromises);
      
      toast.success(`${selectedFiles.length} photo(s) uploaded successfully!`, {
        description: `${photoType.charAt(0).toUpperCase() + photoType.slice(1)} photos for ${patient?.name || 'patient'}`,
      });
      
      // Clean up and navigate back
      selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setSelectedFiles([]);
      navigate(`/photo-manager`);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="lg:col-span-2 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/photo-manager`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Photo Manager
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Photos</h1>
            <p className="text-gray-600 mt-1">
              Upload before/after treatment photos for {patient ? patient.name : 'new patient'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Sidebar */}
        <div className="lg:col-span-1 lg:order-1">
          {patient ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Patient Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3">
                      {patient.avatar ? (
                        <img 
                          src={patient.avatar} 
                          alt={patient.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{patient.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Visit:</span>
                      <p className="text-gray-600">{patient.lastVisit}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Visits:</span>
                      <p className="text-gray-600">{patient.totalVisits}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Select Patient</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  For demo purposes, photos will be uploaded for a sample patient.
                </p>
                <Button asChild className="w-full">
                  <Link to="/patients">
                    <User size={16} className="mr-2" />
                    Select from Patients
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Upload Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upload Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photoType">Photo Type</Label>
                <Select value={photoType} onValueChange={(value: 'before' | 'after' | 'in-progress') => setPhotoType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select photo type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before Treatment</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="after">After Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session identifier"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier for this photo session
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about these photos..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        <div className="lg:col-span-2 lg:order-2 space-y-6">
          {/* Drag & Drop Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera size={20} />
                <span>Upload Photos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Drop images here' : 'Upload Treatment Photos'}
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop images here, or click to select files
                </p>
                <p className="text-sm text-gray-400">
                  Supports: JPEG, PNG, GIF, BMP, WebP (Max 10MB per file)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon size={20} />
                  <span>Selected Photos ({selectedFiles.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map(({ file, preview, id }) => (
                    <div key={id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 w-full">
                        <img
                          src={preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeFile(id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
                      setSelectedFiles([]);
                    }}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear All
                  </Button>
                  <p className="text-sm text-gray-500">
                    {selectedFiles.length} file(s) selected
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/photo-manager`)}
                  disabled={isUploading}
                  className="order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="order-1 sm:order-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
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

export default PhotoUpload;