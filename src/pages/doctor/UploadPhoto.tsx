// src/pages/doctor/UploadPhoto.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Image as ImageIcon
} from 'lucide-react';
import DoctorService from '@/services/doctor.service';
import PhotoService from '@/services/photo.service';
import { toast } from 'sonner';

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

const UploadPhoto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [photoType, setPhotoType] = useState<'before' | 'after'>('before');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (id) {
      loadPatientDetails(id);
      setSessionId(`session_${Date.now()}`);
    }
  }, [id]);

  const loadPatientDetails = async (patientId: string) => {
    try {
      setLoading(true);
      const data = await DoctorService.getPatientDetails(patientId);
      setPatient(data);
    } catch (err) {
      toast.error('Failed to load patient details');
      navigate('/doctor');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((files: File[]) => {
    const valid = files.filter(f => {
      if (!f.type.startsWith('image/')) {
        toast.error(`${f.name} is not an image`);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 10MB`);
        return false;
      }
      return true;
    });

    const withPreview = valid.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setSelectedFiles(prev => [...prev, ...withPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'] },
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => {
      const removed = prev.find(f => f.id === fileId);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleUpload = async () => {
    if (!sessionId.trim()) {
      return toast.error('Session ID is required');
    }
    if (!selectedFiles.length) {
      return toast.error('Select at least one image');
    }
    if (!id || !patient) return;

    try {
      setIsUploading(true);

      await Promise.all(selectedFiles.map(({ file }) => {
        const form = new FormData();
        form.append('file', file);
        form.append('patientId', id);
        form.append('type', photoType);
        form.append('sessionId', sessionId);
        return PhotoService.uploadPatientPhoto(form);
      }));

      toast.success(
        `${selectedFiles.length} photo(s) uploaded for ${photoType} session`,
        { description: patient.name }
      );

      // clean up previews
      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
      setSelectedFiles([]);

      navigate(`/doctor/patient/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed, please try again');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [selectedFiles]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="h-64 bg-gray-200 rounded-lg lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium">Patient not found</h3>
        <Button onClick={() => navigate('/doctor')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
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
            onClick={() => navigate(`/doctor/patient/${id}`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Patient
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Upload Photos</h1>
            <p className="text-gray-600">
              {photoType === 'before'
                ? 'Before treatment'
                : 'After treatment'}{' '}
              photos for {patient.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User size={20} /> <span>Patient Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                {patient.avatar ? (
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-20 h-20 rounded-full mx-auto border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-xl">
                    {patient.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>
                )}
                <h3 className="font-bold">{patient.name}</h3>
                <p className="text-sm text-gray-500">
                  {patient.age} yrs • {patient.gender}
                </p>
              </div>
              <div className="mt-4 text-sm space-y-1">
                <p>
                  <span className="font-medium">Phone:</span> {patient.phone}
                </p>
                <p>
                  <span className="font-medium">Last Visit:</span>{' '}
                  {patient.lastVisit}
                </p>
                <p>
                  <span className="font-medium">Visits:</span>{' '}
                  {patient.totalVisits}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photoType">Photo Type</Label>
                <Select
                  value={photoType}
                  onValueChange={v => setPhotoType(v as 'before' | 'after')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before</SelectItem>
                    <SelectItem value="after">After</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={e => setSessionId(e.target.value)}
                  placeholder="e.g. session_123"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier for this upload
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main upload area */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera size={20} /> <span>Drop or Select Images</span>
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
                <p className="font-medium text-gray-900 mb-1">
                  {isDragActive
                    ? 'Drop images here'
                    : 'Drag & drop or click to select files'}
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, GIF, BMP, WebP (≤10MB each)
                </p>
              </div>
            </CardContent>
          </Card>

          {selectedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon size={20} />{' '}
                  <span>Selected ({selectedFiles.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map(f => (
                    <div key={f.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={f.preview}
                          alt={f.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeFile(f.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <div className="mt-2">
                        <p className="text-sm font-medium truncate">
                          {f.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(f.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/doctor/patient/${id}`)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFiles.length}
                >
                  {isUploading ? 'Uploading…' : <><Save size={16} className="mr-2" /> Upload</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;
