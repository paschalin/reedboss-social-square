
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Default to false
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, user } = useAuth(); // Access the user object from AuthContext
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is already logged in
    if (!user) {
      const storedUser = localStorage.getItem('reedboss_user');
      if (!storedUser) {
        setIsOpen(true); // Open dialog if no user is found
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegistering) {
        await register(username, email, password);
        toast({
          title: "Success",
          description: "Registration successful! Welcome to Reedboss!",
        });
      } else {
        await login(username, password);
        toast({
          title: "Success",
          description: "Welcome back to Reedboss!",
        });
      }
      setIsOpen(false); // Close the dialog on success
    } catch (error) {
      toast({
        title: "Error",
        description: isRegistering ? "Registration failed. Please try again." : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const onClose = () => {
    setIsOpen(false); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRegistering ? 'Create Account' : 'Welcome Back'}</DialogTitle>
        </DialogHeader>
        <Card className="p-6 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {isRegistering && (
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
            </Button>
            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-sm text-primary hover:underline mt-4"
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}