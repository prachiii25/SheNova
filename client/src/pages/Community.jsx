import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Heart, MessageSquare, Share2, Sparkles, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';

export const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Rohini Deshmukh',
      role: 'Returned after 4 yrs • Now Tech Lead at FinTech',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      time: '2 hours ago',
      content: 'Just signed my returnship offer letter! To any sister reading this who feels invisible after a baby break: your experience is so valuable. Please do not discount yourself.',
      cheers: 42,
      comments: 9,
      hasCheered: false,
    },
    {
      id: 2,
      author: 'Sunita Menon',
      role: 'Returner Candidate • 3 yrs Childcare Break',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      time: 'Yesterday',
      content: 'Anyone else practicing the AI Mock Interview on SheNova? The scenario feedback really helped calm my interview anxiety before tomorrow\'s real discussion.',
      cheers: 28,
      comments: 6,
      hasCheered: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');

  const handleCheer = (id) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const cheered = !p.hasCheered;
          toast.success(cheered ? 'Sent cheer & love!' : 'Removed cheer');
          return {
            ...p,
            cheers: cheered ? p.cheers + 1 : p.cheers - 1,
            hasCheered: cheered,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      toast.error('Please write something to share.');
      return;
    }
    const newEntry = {
      id: Date.now(),
      author: 'Ananya Sharma',
      role: 'Product Specialist (You)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      time: 'Just now',
      content: newPostText,
      cheers: 1,
      comments: 0,
      hasCheered: true,
    };
    setPosts([newEntry, ...posts]);
    setNewPostText('');
    setIsModalOpen(false);
    toast.success('Your message has been posted to the Sisterhood Circle!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">Sisterhood Circle</Badge>
            <Badge variant="demo" size="sm">Sample Discussions</Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink">
            Community & Peer Support
          </h2>
          <p className="text-sm text-ink-muted">
            Connect with women who walked this path before and mentors ready to open doors.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Share with Circle
        </Button>
      </div>

      <div className="space-y-4 max-w-3xl">
        {posts.map((post) => (
          <Card key={post.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-ink">{post.author}</h4>
                  <p className="text-[11px] text-ink-muted">{post.role}</p>
                </div>
              </div>
              <span className="text-xs text-ink-subtle">{post.time}</span>
            </div>

            <p className="text-sm text-ink leading-relaxed mb-4">{post.content}</p>

            <div className="flex items-center gap-6 pt-3 border-t border-surface-border/60 text-xs text-ink-muted">
              <button
                type="button"
                onClick={() => handleCheer(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.hasCheered ? 'text-accent-600 font-bold' : 'hover:text-accent-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.hasCheered ? 'fill-accent-500 text-accent-500' : ''}`} />
                <span>{post.cheers} Cheers</span>
              </button>

              <button
                type="button"
                onClick={() => toast('Comment section preview for demo.')}
                className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments} Responses</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Share with the Sisterhood Circle"
        description="Ask a question, celebrate a small win, or share words of encouragement."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreatePost}>
              Post to Circle
            </Button>
          </>
        }
      >
        <Textarea
          rows={4}
          placeholder="What is on your mind today?"
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Community;
