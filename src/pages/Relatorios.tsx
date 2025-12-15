import { useRef } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { MonthMetrics } from "@/components/dashboard/MonthMetrics";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card } from "@/components/ui/card";
import { FileText, Download, Calendar, TrendingUp, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Relatorios = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    toast({
      title: "Exportando PDF",
      description: "Seu relatório está sendo gerado...",
    });

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`relatorio-flyagency-${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: "PDF Exportado!",
        description: "O relatório foi salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Relatórios</h2>
              <p className="text-sm md:text-base text-muted-foreground">Análise detalhada de faturamento e desempenho</p>
            </div>
            <Button className="gap-2 hover-scale w-full sm:w-auto" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>

          {/* Conteúdo para exportação PDF */}
          <div ref={reportRef} className="bg-background">
          {/* Resumo do período */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <Card className="p-3 md:p-4 shadow-card border-0 animate-scale-in hover-lift">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Total 30 dias</p>
                  <p className="text-sm md:text-lg font-bold truncate">R$ 45.000,00</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 md:p-4 shadow-card border-0 animate-scale-in hover-lift" style={{ animationDelay: '50ms' }}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 shrink-0">
                  <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Contratos Novos</p>
                  <p className="text-sm md:text-lg font-bold">8</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 md:p-4 shadow-card border-0 animate-scale-in hover-lift" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-warning/10 shrink-0">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-warning" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Ticket Médio</p>
                  <p className="text-sm md:text-lg font-bold">R$ 3.500,00</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 md:p-4 shadow-card border-0 animate-scale-in hover-lift" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-accent/10 shrink-0">
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Clientes Ativos</p>
                  <p className="text-sm md:text-lg font-bold">12</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="space-y-4 md:space-y-6">
            <MonthMetrics />
            <SalesChart />
          </div>
          </div>
        </main>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Relatorios;