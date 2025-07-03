import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Image, 
  Upload, 
  Search, 
  Eye,
  Calendar,
  User,
  Plus,
  RefreshCw
} from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { getPhotoSessions, getPhotoStats } from '@/api/photos';
import type { PhotoSession, PhotoStats } from '@/api/photos';
import { toast } from 'sonner';
import PhotoService from '@/services/photo.service';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

const PhotoManager: React.FC = () => {
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [stats, setStats] = useState<PhotoStats>({
    totalImages: 0,
    patientsWithPhotos: 0,
    beforeAfterSets: 0,
    uploadedToday: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, statsData] = await Promise.all([
        PhotoService.getPhotoSessions(),
        PhotoService.getPhotoStats()
      ]);
      setSessions(sessionsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load photo manager data');
      console.error('Error loading photo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, href }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50'
    };

    const colorClass = colorClasses[color];

    const CardContentComponent = (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${colorClass}`}>
              <Icon size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return href ? <Link to={href}>{CardContentComponent}</Link> : CardContentComponent;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Photo Manager</h1>
          <p className="text-gray-600 mt-1">Manage patient before and after photos</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link to={`/photo-manager/upload/new`}>
              <Upload size={16} className="mr-2" />
              Upload Photos
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Images"
          value={stats.totalImages}
          subtitle="Stored in system"
          icon={Image}
          color="blue"
        />
        <StatsCard
          title="Patients With Photos"
          value={stats.patientsWithPhotos}
          subtitle="Documented patients"
          icon={User}
          color="green"
        />
        <StatsCard
          title="Before/After Sets"
          value={stats.beforeAfterSets}
          subtitle="Complete comparisons"
          icon={Camera}
          color="purple"
        />
        <StatsCard
          title="Uploaded Today"
          value={stats.uploadedToday}
          subtitle="New images"
          icon={Upload}
          color="orange"
        />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search by patient name, procedure, or doctor..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Camera size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photo sessions found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by uploading photos for a patient'}
              </p>
              <Button asChild>
                <Link to={`/photo-manager/upload/new`}>
                  <Plus size={16} className="mr-2" />
                  Upload Photos
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-3 gap-1 w-full h-full">
                  {session.beforeCount > 0 && (
                    <div className="bg-blue-50 flex items-center justify-center">
                      <div className="text-center">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">BEFORE</Badge>
                        <p className="text-sm mt-1">{session.beforeCount} photos</p>
                      </div>
                    </div>
                  )}
                  {session.inProgressCount > 0 && (
                    <div className="bg-purple-50 flex items-center justify-center">
                      <div className="text-center">
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">IN PROGRESS</Badge>
                        <p className="text-sm mt-1">{session.inProgressCount} photos</p>
                      </div>
                    </div>
                  )}
                  {session.afterCount > 0 && (
                    <div className="bg-green-50 flex items-center justify-center">
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800 border-green-200">AFTER</Badge>
                        <p className="text-sm mt-1">{session.afterCount} photos</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900">{session.patientName}</h3>
                  <p className="text-sm text-gray-500">{session.procedure}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{session.doctorName}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/photo-manager/patient/${session.patientId}`}>
                      <Eye size={14} className="mr-1" />
                      View Gallery
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link to={`/photo-manager/upload/${session.patientId}`}>
                      <Upload size={14} className="mr-1" />
                      Upload New
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PhotoManager;