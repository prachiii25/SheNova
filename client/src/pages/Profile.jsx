import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Shield, Briefcase, Clock, Heart, Check, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Ananya Sharma',
    email: user?.email || 'ananya.sharma@example.com',
    targetRole: user?.targetRole || 'Senior Product Manager',
    breakReason: user?.careerBreakReason || 'Childcare & Family Care',
    breakDuration: user?.breakDuration || '3.5 years',
    priorRole: 'Product Manager (5 years prior exp)',
    preferredMode: 'Remote / Hybrid with Flexible Hours',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        name: formData.name,
        targetRole: formData.targetRole,
        careerBreakReason: formData.breakReason,
        breakDuration: formData.breakDuration,
      }));
      setIsSaving(false);
      toast.success('Returner profile preferences updated successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="primary" size="sm">Account & Preferences</Badge>
          <Badge variant="demo" size="sm">Demo Profile</Badge>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink">
          My Returner Profile
        </h2>
        <p className="text-sm text-ink-muted">
          Manage your personal details, career break history, and work-life flexibility preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your contact details displayed on verified applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-200"
              />
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast('Profile photo upload preview.')}
                >
                  Change Avatar
                </Button>
                <p className="text-[11px] text-ink-subtle mt-1">Recommended: square 400x400 JPG or PNG</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                value={formData.email}
                disabled
                helperText="Email is managed via your secure authentication account"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Break & Returnship Alignment</CardTitle>
            <CardDescription>
              This information powers your personalized roadmap and resume generator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Primary Reason for Pause"
                value={formData.breakReason}
                onChange={(e) => setFormData({ ...formData, breakReason: e.target.value })}
                options={[
                  'Childcare & Family Care',
                  'Motherhood & Early Child Development',
                  'Marriage & International Relocation',
                  'Elder Care & Family Support',
                  'Personal Health & Rejuvenation',
                  'Career Pivot & Education',
                ]}
              />

              <Input
                label="Break Duration"
                value={formData.breakDuration}
                onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Role / Level"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              />

              <Input
                label="Prior Domain & Experience"
                value={formData.priorRole}
                onChange={(e) => setFormData({ ...formData, priorRole: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Returner Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
