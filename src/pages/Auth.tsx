import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Mail, KeyRound } from 'lucide-react';
import logoFly from '@/assets/logo-fly.png';
import { z } from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const emailSchema = z.string().trim().email('Email inválido').max(255);
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').max(72);

type AuthMode = 'login' | 'signup' | 'verify-email' | 'forgot-password' | 'reset-password';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const { signIn, signUp, user, resetPassword, verifyOtp, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      return;
    }
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast.error(passwordValidation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Confirme seu email antes de fazer login');
        } else {
          toast.error('Erro ao fazer login');
        }
      } else {
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      return;
    }
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast.error(passwordValidation.error.errors[0].message);
      return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error('Erro ao criar conta');
        }
      } else {
        toast.success('Verifique seu email para confirmar a conta!');
        setMode('verify-email');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpToken.length !== 6) {
      toast.error('Digite o código completo de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifyOtp(email, otpToken, 'signup');
      if (error) {
        toast.error('Código inválido ou expirado');
      } else {
        toast.success('Email confirmado com sucesso!');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error('Erro ao enviar email de recuperação');
      } else {
        toast.success('Verifique seu email para redefinir a senha!');
        setMode('reset-password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (otpToken.length !== 6) {
      toast.error('Digite o código completo de 6 dígitos');
      return;
    }
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast.error(passwordValidation.error.errors[0].message);
      return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const { error: verifyError } = await verifyOtp(email, otpToken, 'recovery');
      if (verifyError) {
        toast.error('Código inválido ou expirado');
        return;
      }
      
      const { error: updateError } = await updatePassword(password);
      if (updateError) {
        toast.error('Erro ao atualizar senha');
      } else {
        toast.success('Senha atualizada com sucesso!');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (mode) {
      case 'login':
        handleLogin();
        break;
      case 'signup':
        handleSignup();
        break;
      case 'verify-email':
        handleVerifyOtp();
        break;
      case 'forgot-password':
        handleForgotPassword();
        break;
      case 'reset-password':
        handleResetPassword();
        break;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Entrar';
      case 'signup': return 'Criar Conta';
      case 'verify-email': return 'Confirmar Email';
      case 'forgot-password': return 'Recuperar Senha';
      case 'reset-password': return 'Nova Senha';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Acesse seu dashboard Fly Agency';
      case 'signup': return 'Crie sua conta para acessar o dashboard';
      case 'verify-email': return `Digite o código enviado para ${email}`;
      case 'forgot-password': return 'Digite seu email para recuperar a senha';
      case 'reset-password': return `Digite o código enviado para ${email}`;
    }
  };

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setOtpToken('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'hsl(var(--auth-background))' }}>
      <Card className="w-full max-w-md shadow-2xl border-0 animate-scale-in">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-purple">
            <img src={logoFly} alt="Fly Agency" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {getDescription()}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field - shown for login, signup, forgot-password */}
            {(mode === 'login' || mode === 'signup' || mode === 'forgot-password') && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  autoComplete="email"
                />
              </div>
            )}

            {/* OTP field - shown for verify-email and reset-password */}
            {(mode === 'verify-email' || mode === 'reset-password') && (
              <div className="space-y-2">
                <Label>Código de Verificação</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpToken}
                    onChange={setOtpToken}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            )}
            
            {/* Password field - shown for login, signup, reset-password */}
            {(mode === 'login' || mode === 'signup' || mode === 'reset-password') && (
              <div className="space-y-2">
                <Label htmlFor="password">{mode === 'reset-password' ? 'Nova Senha' : 'Senha'}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Confirm password field - shown for signup and reset-password */}
            {(mode === 'signup' || mode === 'reset-password') && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {/* Forgot password link - shown only for login */}
            {mode === 'login' && (
              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-accent p-0 h-auto text-sm"
                  onClick={() => { resetForm(); setMode('forgot-password'); }}
                >
                  Esqueceu a senha?
                </Button>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-11 gradient-primary text-primary-foreground font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Carregando...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta
                </>
              ) : mode === 'verify-email' ? (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Confirmar Email
                </>
              ) : mode === 'forgot-password' ? (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Código
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Atualizar Senha
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            {(mode === 'login' || mode === 'signup') && (
              <Button
                variant="link"
                className="text-primary hover:text-accent"
                onClick={() => { resetForm(); setMode(mode === 'login' ? 'signup' : 'login'); }}
              >
                {mode === 'login' 
                  ? 'Não tem conta? Criar agora' 
                  : 'Já tem conta? Fazer login'
                }
              </Button>
            )}

            {(mode === 'verify-email' || mode === 'forgot-password' || mode === 'reset-password') && (
              <Button
                variant="link"
                className="text-primary hover:text-accent"
                onClick={() => { resetForm(); setMode('login'); }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar ao login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
