import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Pencil, Check, X } from "lucide-react";

interface EditableStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "accent" | "success" | "warning";
  delay?: number;
  editable?: boolean;
  onValueChange?: (value: string) => void;
}

const variantStyles = {
  default: "bg-card",
  accent: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  accent: "bg-primary-foreground/20 text-primary-foreground",
  success: "bg-success-foreground/20 text-success-foreground",
  warning: "bg-warning-foreground/20 text-warning-foreground",
};

export function EditableStatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default", 
  delay = 0,
  editable = false,
  onValueChange
}: EditableStatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onValueChange?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <Card 
      className={cn(
        "p-4 md:p-6 shadow-card border-0 hover-lift animate-scale-in opacity-0 group relative",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {editable && !isEditing && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-6 w-6 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity",
            variant !== "default" && "text-primary-foreground hover:bg-primary-foreground/20"
          )}
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="w-3 h-3" />
        </Button>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1 md:space-y-2 flex-1 min-w-0">
          <p className={cn(
            "text-xs md:text-sm font-medium",
            variant === "default" ? "text-muted-foreground" : "opacity-80"
          )}>
            {title}
          </p>
          
          {isEditing ? (
            <div className="flex items-center gap-1 md:gap-2 flex-wrap">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={cn(
                  "text-base md:text-xl font-bold h-8 md:h-10 w-full max-w-[150px]",
                  variant !== "default" && "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
                )}
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-7 w-7 md:h-8 md:w-8 shrink-0" onClick={handleSave}>
                <Check className={cn("w-3 h-3 md:w-4 md:h-4", variant !== "default" ? "text-primary-foreground" : "text-success")} />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 md:h-8 md:w-8 shrink-0" onClick={handleCancel}>
                <X className={cn("w-3 h-3 md:w-4 md:h-4", variant !== "default" ? "text-primary-foreground" : "text-destructive")} />
              </Button>
            </div>
          ) : (
            <p className="text-xl md:text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform origin-left truncate">
              {value}
            </p>
          )}
          
          {subtitle && (
            <p className={cn(
              "text-xs md:text-sm",
              variant === "default" ? "text-muted-foreground" : "opacity-70"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs md:text-sm font-medium px-2 py-0.5 md:py-1 rounded-full",
              trend.isPositive 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              <span className="animate-pulse-soft">{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-2 md:p-3 rounded-xl transition-transform group-hover:scale-110 group-hover:rotate-3 shrink-0 ml-2",
          iconVariantStyles[variant]
        )}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </Card>
  );
}
