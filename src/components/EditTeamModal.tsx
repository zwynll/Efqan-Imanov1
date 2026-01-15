import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/types";

interface EditTeamModalProps {
  team: Team;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTeamModal = ({ team, onClose, onSuccess }: EditTeamModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    commander: team.commander || "",
    commanderRank: team.commanderRank || "",
    commanderContact: team.commanderContact || "",
    subCommander1: team.subCommander1 || "",
    subCommander1Rank: team.subCommander1Rank || "",
    subCommander1Contact: team.subCommander1Contact || "",
    subCommander2: team.subCommander2 || "",
    subCommander2Rank: team.subCommander2Rank || "",
    subCommander2Contact: team.subCommander2Contact || "",
    subCommander3: team.subCommander3 || "",
    subCommander3Rank: team.subCommander3Rank || "",
    subCommander3Contact: team.subCommander3Contact || "",
  });

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const subCommanderSections = useMemo(
    () => [
      {
        key: "subCommander1" as const,
        rankKey: "subCommander1Rank" as const,
        contactKey: "subCommander1Contact" as const,
        label: "Manga Komandiri 1",
      },
      {
        key: "subCommander2" as const,
        rankKey: "subCommander2Rank" as const,
        contactKey: "subCommander2Contact" as const,
        label: "Manga Komandiri 2",
      },
      {
        key: "subCommander3" as const,
        rankKey: "subCommander3Rank" as const,
        contactKey: "subCommander3Contact" as const,
        label: "Manga Komandiri 3",
      },
    ],
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await (supabase as any)
        .from("teams")
        .update({
          commander: formData.commander,
          commander_rank: formData.commanderRank || null,
          commander_contact: formData.commanderContact,
          sub_commander_1: formData.subCommander1 || null,
          sub_commander_1_rank: formData.subCommander1Rank || null,
          sub_commander_1_contact: formData.subCommander1Contact || null,
          sub_commander_2: formData.subCommander2 || null,
          sub_commander_2_rank: formData.subCommander2Rank || null,
          sub_commander_2_contact: formData.subCommander2Contact || null,
          sub_commander_3: formData.subCommander3 || null,
          sub_commander_3_rank: formData.subCommander3Rank || null,
          sub_commander_3_contact: formData.subCommander3Contact || null,
        })
        .eq("id", team.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Uğurlu",
        description: "Taqım rəhbərliyi yeniləndi",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating team commander:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Taqım komandiri yenilənərkən xəta baş verdi",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{team.name} rəhbərliyini redaktə et</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="commander">Taqım komandiri</Label>
              <Input
                id="commander"
                value={formData.commander}
                onChange={handleChange("commander")}
                required
                placeholder="Əli Məmmədov"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commander-rank">Rütbə</Label>
              <Input
                id="commander-rank"
                value={formData.commanderRank}
                onChange={handleChange("commanderRank")}
                placeholder="Mayor"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commander-contact">Əlaqə nömrəsi</Label>
              <Input
                id="commander-contact"
                value={formData.commanderContact}
                onChange={handleChange("commanderContact")}
                required
                placeholder="+994 XX XXX XX XX"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-foreground/80">Manga komandirləri (maksimum 3 nəfər)</Label>

            {subCommanderSections.map(({ key, rankKey, contactKey, label }) => (
              <div key={key} className="grid gap-4 border border-dashed border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
                <div className="space-y-2">
                  <Label htmlFor={`${key}`}>Ad Soyad</Label>
                  <Input
                    id={`${key}`}
                    value={formData[key]}
                    onChange={handleChange(key)}
                    placeholder="Ramin Əliyev"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${rankKey}`}>Rütbə</Label>
                  <Input
                    id={`${rankKey}`}
                    value={formData[rankKey]}
                    onChange={handleChange(rankKey)}
                    placeholder="Leytenant"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${contactKey}`}>Əlaqə nömrəsi</Label>
                  <Input
                    id={`${contactKey}`}
                    value={formData[contactKey]}
                    onChange={handleChange(contactKey)}
                    placeholder="+994 XX XXX XX XX"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Ləğv et
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary hover:bg-gradient-primary/90">
              {isSubmitting ? "Yenilənir..." : "Yadda saxla"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamModal;


