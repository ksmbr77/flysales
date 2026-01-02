import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Calendar, Mail, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function Usuarios() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_sign_in_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOnlineRecently = (lastSignIn: string | null) => {
    if (!lastSignIn) return false;
    const diffHours = (Date.now() - new Date(lastSignIn).getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
  };

  const formatFullDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yy", { locale: ptBR });
  };

  const activeCount = profiles.filter(p => isOnlineRecently(p.last_sign_in_at)).length;
  const newThisMonth = profiles.filter(p => {
    const createdAt = new Date(p.created_at);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Usuários</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchProfiles} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Total</span>
            </div>
            <p className="text-2xl font-bold">{profiles.length}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Ativos 24h</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{activeCount}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Novos</span>
            </div>
            <p className="text-2xl font-bold text-primary">{newThisMonth}</p>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nenhum usuário ainda</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{profile.email || '-'}</p>
                        <p className="text-xs text-muted-foreground">
                          Cadastro: {formatFullDate(profile.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(profile.last_sign_in_at)}
                        </p>
                      </div>
                      {isOnlineRecently(profile.last_sign_in_at) ? (
                        <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Inativo
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
