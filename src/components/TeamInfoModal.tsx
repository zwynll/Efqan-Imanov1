import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Team } from "@/types";
import { Shield, Phone, Users } from "lucide-react";

interface TeamInfoModalProps {
  team: Team;
  onClose: () => void;
}

const TeamInfoModal = ({ team, onClose }: TeamInfoModalProps) => {
  const subCommanders = [
    {
      label: "Manga Komandiri 1",
      name: team.subCommander1,
      rank: team.subCommander1Rank,
      contact: team.subCommander1Contact,
    },
    {
      label: "Manga Komandiri 2",
      name: team.subCommander2,
      rank: team.subCommander2Rank,
      contact: team.subCommander2Contact,
    },
    {
      label: "Manga Komandiri 3",
      name: team.subCommander3,
      rank: team.subCommander3Rank,
      contact: team.subCommander3Contact,
    },
  ].filter((commander) => commander.name);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{team.name} - Rəhbərlik</DialogTitle>
          <DialogDescription>
            Taqım komandiri və manga komandirinin əlaqə məlumatları
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {/* Commander */}
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">Taqım Komandiri</h3>
                <p className="text-muted-foreground">{team.commanderRank || 'Rütbə məlum deyil'}</p>
                <p className="text-foreground font-medium mt-1">
                  {team.commander || 'Komandir təyin edilməyib'}
                </p>
                {team.commanderContact && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{team.commanderContact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub Commanders */}
          {subCommanders.map((subCommander, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{subCommander.label}</h3>
                  <p className="text-muted-foreground">{subCommander.rank || 'Rütbə məlum deyil'}</p>
                  <p className="text-foreground font-medium mt-1">{subCommander.name}</p>
                  {subCommander.contact && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{subCommander.contact}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamInfoModal;
