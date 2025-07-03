import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  User,
  Calendar,
  Stethoscope,
  Maximize,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { getPatientDetails } from '@/api/doctor';
import { getAllPatientPhotos, getPhotoSessions, deletePhoto } from '@/api/photos';
import type { PatientPhoto, PhotoSession } from '@/api/photos';
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

interface PhotosBySession {
  [sessionId: string]: {
    session: PhotoSession;
    photos: {
      before: PatientPhoto[];
      inProgress: PatientPhoto[];
      after: PatientPhoto[];
    };
  };
}

const PatientGallery: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [photos, setPhotos] = useState<PatientPhoto[]>([]);
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [photosBySession, setPhotosBySession] = useState<PhotosBySession>({});
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<PatientPhoto | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<PatientPhoto | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<PatientPhoto | null>(null);

  useEffect(() => {
    if (patientId) {
      loadData();
    }
  }, [patientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [patientData, photosData, sessionsData] = await Promise.all([
        DoctorService.getPatientDetails(patientId!),
        PhotoService.getAllPatientPhotos({ patientId: patientId! }),
        PhotoService.getPhotoSessions(patientId!)
      ]);
      
      setPatient(patientData);
      setPhotos(photosData);
      setSessions(sessionsData);
      
      // Organize photos by session
      const photosBySess: PhotosBySession = {};
      
      sessionsData.forEach(session => {
        const sessionPhotos = photosData.filter(photo => photo.sessionId === session.id);
        
        photosBySess[session.id] = {
          session,
          photos: {
            before: sessionPhotos.filter(photo => photo.type === 'before'),
            inProgress: sessionPhotos.filter(photo => photo.type === 'in-progress'),
            after: sessionPhotos.filter(photo => photo.type === 'after')
          }
        };
      });
      
      setPhotosBySession(photosBySess);
    } catch (error) {
      toast.error('Failed to load patient gallery');
      console.error('Error loading gallery:', error);
      navigate('/photo-manager');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await PhotoService.deletePhoto(photoId);
      await loadData();
      toast.success('Photo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete photo');
      console.error('Error deleting photo:', error);
    }
  };

  const openLightbox = (photo: PatientPhoto) => {
    setCurrentPhoto(photo);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentPhoto(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!currentPhoto) return;
    
    const currentIndex = photos.findIndex(p => p.id === currentPhoto.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    }
    
    setCurrentPhoto(photos[newIndex]);
  };

  const openCompareView = (sessionId: string) => {
    const sessionData = photosBySession[sessionId];
    if (!sessionData) return;
    
    const beforePhotos = sessionData.photos.before;
    const afterPhotos = sessionData.photos.after;
    
    if (beforePhotos.length === 0 || afterPhotos.length === 0) {
      toast.error('Both before and after photos are required for comparison');
      return;
    }
    
    setBeforePhoto(beforePhotos[0]);
    setAfterPhoto(afterPhotos[0]);
    setCompareMode(true);
  };

  const getPhotoTypeColor = (type: string) => {
    const colors = {
      before: 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
      after: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[type as keyof typeof colors] || colors.before;
  };

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

  if (!patient) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Patient not found</h3>
        <Button onClick={() => navigate('/photo-manager')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Photo Manager
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
            onClick={() => navigate(`/photo-manager`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Photo Manager
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Gallery</h1>
            <p className="text-gray-600 mt-1">
              Viewing photos for {patient.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild>
            <a href={`/photo-manager/upload/${patientId}`}>
              <Upload size={16} className="mr-2" />
              Upload New Photos
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={20} />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3">
                  {patient.avatar ? (
                    <img 
                      src={patient.avatar} 
                      alt={patient.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                <p className="text-gray-500">{patient.age} years • {patient.gender}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">Last visit: {patient.lastVisit}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Camera size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">Total sessions: {sessions.length}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Stethoscope size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">Total photos: {photos.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Gallery */}
        <div className="lg:col-span-3 space-y-6">
          {Object.keys(photosBySession).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Camera size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No photos available</h3>
                <p className="text-gray-500 mb-4">
                  This patient doesn't have any photos yet
                </p>
                <Button asChild>
                  <a href={`/photo-manager/upload/${patientId}`}>
                    <Upload size={16} className="mr-2" />
                    Upload Photos
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(photosBySession).map(([sessionId, { session, photos }]) => (
              <Card key={sessionId} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar size={18} />
                      <span>{session.procedure} - {new Date(session.date).toLocaleDateString()}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {photos.before.length > 0 && photos.after.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openCompareView(sessionId)}
                        >
                          Compare Before/After
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Photos</TabsTrigger>
                      <TabsTrigger value="before">Before</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="after">After</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...photos.before, ...photos.inProgress, ...photos.after].map((photo) => (
                          <div key={photo.id} className="relative group">
                            <div 
                              className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                              onClick={() => openLightbox(photo)}
                            >
                              <img
                                src={photo.thumbnailUrl}
                                alt={`${photo.type} photo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute top-2 left-2">
                              <Badge 
                                className={`capitalize ${getPhotoTypeColor(photo.type)}`}
                              >
                                {photo.type.replace('-', ' ')}
                              </Badge>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => handleDeletePhoto(photo.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="secondary" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => openLightbox(photo)}
                              >
                                <Maximize size={14} />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(photo.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="before">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.before.length === 0 ? (
                          <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No before photos available</p>
                          </div>
                        ) : (
                          photos.before.map((photo) => (
                            <div key={photo.id} className="relative group">
                              <div 
                                className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                                onClick={() => openLightbox(photo)}
                              >
                                <img
                                  src={photo.thumbnailUrl}
                                  alt="Before photo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  BEFORE
                                </Badge>
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="secondary" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => openLightbox(photo)}
                                >
                                  <Maximize size={14} />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(photo.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="in-progress">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.inProgress.length === 0 ? (
                          <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No in-progress photos available</p>
                          </div>
                        ) : (
                          photos.inProgress.map((photo) => (
                            <div key={photo.id} className="relative group">
                              <div 
                                className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                                onClick={() => openLightbox(photo)}
                              >
                                <img
                                  src={photo.thumbnailUrl}
                                  alt="In-progress photo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                  IN PROGRESS
                                </Badge>
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="secondary" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => openLightbox(photo)}
                                >
                                  <Maximize size={14} />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(photo.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="after">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.after.length === 0 ? (
                          <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No after photos available</p>
                          </div>
                        ) : (
                          photos.after.map((photo) => (
                            <div key={photo.id} className="relative group">
                              <div 
                                className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                                onClick={() => openLightbox(photo)}
                              >
                                <img
                                  src={photo.thumbnailUrl}
                                  alt="After photo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  AFTER
                                </Badge>
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="secondary" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => openLightbox(photo)}
                                >
                                  <Maximize size={14} />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(photo.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeLightbox}
                className="text-white hover:bg-white/20"
              >
                <X size={24} />
              </Button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={currentPhoto.imageUrl}
                alt={`${currentPhoto.type} photo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigateLightbox('prev')}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft size={36} />
              </Button>
            </div>
            
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigateLightbox('next')}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight size={36} />
              </Button>
            </div>
            
            <div className="bg-black bg-opacity-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge 
                    className={`capitalize ${getPhotoTypeColor(currentPhoto.type)}`}
                  >
                    {currentPhoto.type.replace('-', ' ')}
                  </Badge>
                  <p className="text-white text-sm mt-1">
                    {new Date(currentPhoto.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      handleDeletePhoto(currentPhoto.id);
                      closeLightbox();
                    }}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete Photo
                  </Button>
                </div>
              </div>
              {currentPhoto.notes && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-white text-sm">
                  <p className="font-medium mb-1">Notes:</p>
                  <p>{currentPhoto.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compare View */}
      {compareMode && beforePhoto && afterPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCompareMode(false)}
                className="text-white hover:bg-white/20"
              >
                <X size={24} />
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 gap-4">
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <Badge className="mb-2 bg-blue-100 text-blue-800 border-blue-200">BEFORE</Badge>
                <div className="relative w-full h-[300px] md:h-[500px]">
                  <img
                    src={beforePhoto.imageUrl}
                    alt="Before photo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-white text-sm mt-2">
                  {new Date(beforePhoto.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <Badge className="mb-2 bg-green-100 text-green-800 border-green-200">AFTER</Badge>
                <div className="relative w-full h-[300px] md:h-[500px]">
                  <img
                    src={afterPhoto.imageUrl}
                    alt="After photo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-white text-sm mt-2">
                  {new Date(afterPhoto.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="bg-black bg-opacity-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">
                    {patient.name} - {beforePhoto.sessionId}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setCompareMode(false)}
                >
                  Close Comparison
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientGallery;