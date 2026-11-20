import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  User,
  Shield,
  Briefcase,
  Clock,
  Heart,
  Check,
  Save,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Camera,
  Layers,
} from 'lucide-react';

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Select,
  Textarea,
  Badge,
} from '../components/ui';

import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Avatar presets for quick switching
  const avatarPresets = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Ananya Sharma',
    email: user?.email || 'ananya.sharma@example.com',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Bengaluru, India (Open to Remote / Hybrid)',
    avatar:
      user?.avatar ||
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio:
      user?.bio ||
      'Senior product leader returning after a 3.5-year childcare pause. Dedicated to building inclusive, AI-augmented digital solutions.',
    breakReason: user?.careerBreakReason || 'Childcare & Family Care',
    breakDuration: user?.breakDuration || '3.5 years',
    priorRole: user?.priorRole || 'Product Manager (5 years prior SaaS exp)',
    targetRole: user?.targetRole || 'Senior Product Manager',
    preferredWorkType: user?.preferredWorkType || 'Remote / Flexible Hybrid',
    weeklyHours: user?.weeklyHours || '8 - 10 hours/week',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await authService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone,
        location: formData.location,
        avatar: formData.avatar,
        bio: formData.bio,
        careerBreak: {
          reason: formData.breakReason,
          duration: formData.breakDuration,
          previousRole: formData.priorRole,
          targetRole: formData.targetRole,
          workPreference: formData.preferredWorkType,
          weeklyHours: formData.weeklyHours,
        },
      });

      setUser(updatedUser);
      toast.success('Returner profile preferences saved successfully!');
    } catch (err) {
      // Fallback local update
      const localUpdated = {
        ...user,
        name: formData.name.trim(),
        phone: formData.phone,
        location: formData.location,
        avatar: formData.avatar,
        bio: formData.bio,
        careerBreakReason: formData.breakReason,
        breakDuration: formData.breakDuration,
        priorRole: formData.priorRole,
        targetRole: formData.targetRole,
        preferredWorkType: formData.preferredWorkType,
        weeklyHours: formData.weeklyHours,
      };
      setUser(localUpdated);
      localStorage.setItem('shenova_auth_user', JSON.stringify(localUpdated));
      toast.success('Profile preferences saved locally!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">
              <User className="w-3.5 h-3.5 mr-1" />
              Returner Account & Settings
            </Badge>
            <Badge variant="demo" size="sm">
              Demo Profile Sync
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            My Returner Profile
          </h1>
          <p className="text-sm text-ink-muted">
            Manage your personal credentials, career pause details, and work-life flexibility settings.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
          className="shadow-soft-sm font-semibold"
        >
          Save All Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: PERSONAL DETAILS & AVATAR */}
        <Card className="border border-surface-border shadow-soft-sm">
          <CardHeader className="pb-3 border-b border-surface-border/60">
            <CardTitle className="text-base">1. Personal Information & Identity</CardTitle>
            <CardDescription>
              Details displayed across verified returnship applications and the sisterhood circle
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {/* Avatar Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-surface-subtle rounded-2xl border border-surface-border">
              <img
                src={formData.avatar}
                alt="Profile Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-300 shadow-soft-sm"
              />
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-ink font-heading block">
                  Choose Profile Photo Preset:
                </span>
                <div className="flex items-center gap-2">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: preset })}
                      className={`w-9 h-9 rounded-xl overflow-hidden ring-2 transition-all ${
                        formData.avatar === preset
                          ? 'ring-primary-600 scale-105'
                          : 'ring-surface-border hover:ring-primary-300'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
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
                helperText="Synced with your secure SheNova member login."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label="Location & Flexibility Mode"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <Textarea
              label="Professional Headline / Bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              helperText="A welcoming summary highlighting your leadership perspective and returner readiness."
            />
          </CardContent>
        </Card>

        {/* SECTION 2: CAREER BREAK CONTEXT */}
        <Card className="border border-surface-border shadow-soft-sm">
          <CardHeader className="pb-3 border-b border-surface-border/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <CardTitle className="text-base">2. Career Pause Context & Reframing</CardTitle>
            </div>
            <CardDescription>
              Powers your AI 60-day roadmap pacing and ATS-optimized resume statement
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
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
                  'Personal Health & Recovery',
                  'Career Pivot & Upskilling',
                ]}
              />

              <Select
                label="Pause Duration"
                value={formData.breakDuration}
                onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
                options={['Under 1 year', '1 - 2 years', '2 - 4 years', '3.5 years', '5+ years']}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Prior Job Role & Years Experience"
                value={formData.priorRole}
                onChange={(e) => setFormData({ ...formData, priorRole: e.target.value })}
              />

              <Input
                label="Target Return Role Title"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: WORK-LIFE PREFERENCES */}
        <Card className="border border-surface-border shadow-soft-sm">
          <CardHeader className="pb-3 border-b border-surface-border/60">
            <CardTitle className="text-base">3. Work-Life Flexibility & Pacing</CardTitle>
            <CardDescription>
              Align opportunities with your daily schedule and household commitments
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Work Arrangement"
                value={formData.preferredWorkType}
                onChange={(e) =>
                  setFormData({ ...formData, preferredWorkType: e.target.value })
                }
                options={[
                  'Remote / Flexible Hybrid',
                  'Returnship Cohort (6-Month Ramp)',
                  'Full-Time Onsite / Hybrid',
                  'Part-Time (15-20 hrs/week)',
                ]}
              />

              <Select
                label="Available Learning Sprints Time"
                value={formData.weeklyHours}
                onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                options={[
                  '4 - 6 hours/week (Gentle pace)',
                  '8 - 10 hours/week (Recommended)',
                  '12+ hours/week (Accelerated)',
                ]}
              />
            </div>
          </CardContent>

          <CardFooter className="justify-between pt-3">
            <span className="text-xs text-ink-muted">
              Preferences are automatically updated in your Roadmap and Resume Builder.
            </span>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Profile;
