import { useState } from 'react';
import { User, mockUsers } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Building2, Lock, User as UserIcon, Mail, Phone } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'Staff' as 'Owner' | 'Staff'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Use Supabase authentication
        if (isLogin) {
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });

          if (authError) throw authError;

          if (data.user) {
            // Get user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', data.user.id)
              .single();

            const user: User = {
              id: data.user.id,
              username: formData.email,
              name: profile?.name || formData.email,
              role: profile?.role || 'Staff'
            };

            onLogin(user);
          }
        } else {
          // Register new user
          const { data, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
          });

          if (authError) throw authError;

          if (data.user) {
            // Create user profile
            await supabase.from('profiles').insert({
              user_id: data.user.id,
              name: formData.name,
              role: formData.role
            });

            setMessage('Registration successful! Please check your email to confirm your account, then login.');
            setIsLogin(true);
            setFormData({ ...formData, password: '' });
          }
        }
      } else {
        // Fallback to mock authentication
        if (isLogin) {
          const user = mockUsers.find(u => u.username === formData.email);
          if (user && formData.password === 'password') {
            onLogin(user);
          } else {
            throw new Error('Invalid credentials. Try: admin or staff1 / password');
          }
        } else {
          throw new Error('Supabase not configured. Cannot register new users.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary text-primary-foreground p-4 rounded-full mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">SME CRM System</h1>
            <p className="text-muted-foreground mt-1">Intelligent Customer Relationship Management</p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
                isLogin
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
                !isLogin
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm mb-2 text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm mb-2 text-foreground">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      placeholder="+234 XXX XXX XXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm mb-2 text-foreground">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Owner' | 'Staff' })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    required
                  >
                    <option value="Owner">Business Owner</option>
                    <option value="Staff">Staff Member</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 characters)'}
                  required
                  minLength={isLogin ? undefined : 6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Southern Delta University © 2026 Final Year Project
        </p>
      </div>
    </div>
  );
}
