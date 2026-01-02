import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const isOnlineRecently = (lastSignIn: string | null) => {
    if (!lastSignIn) return false;
    const lastSignInDate = new Date(lastSignIn);
    const now = new Date();
    const diffHours = (now.getTime() - lastSignInDate.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Usuários</h2>
            <p className="text-muted-foreground">Visualize quem criou conta e está acessando o sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ativos nas últimas 24h
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {profiles.filter(p => isOnlineRecently(p.last_sign_in_at)).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Novos este mês
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {profiles.filter(p => {
                  const createdAt = new Date(p.created_at);
                  const now = new Date();
                  return createdAt.getMonth() === now.getMonth() && 
                         createdAt.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum usuário registrado ainda.</p>
                <p className="text-sm">Novos usuários aparecerão aqui ao criar conta.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {profile.email || '-'}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(profile.created_at)}</TableCell>
                        <TableCell>{formatDate(profile.last_sign_in_at)}</TableCell>
                        <TableCell>
                          {isOnlineRecently(profile.last_sign_in_at) ? (
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              Ativo recentemente
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
