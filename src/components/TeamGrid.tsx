import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentTable from "./StudentTable";
import TeamInfoModal from "./TeamInfoModal";
const API_URL = "http://localhost:4000/api";
import { Team } from "@/types";
import { TEAMS } from "@/data/mockData";

interface TeamGridProps {
  courseId: number;
}

const TeamGrid = ({ courseId }: TeamGridProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [infoTeam, setInfoTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    loadTeams();
  }, [courseId]);

  const loadTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/teams?courseId=${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const parsedTeams = data.map((t: any) => ({
            id: t.id,
            name: t.name,
            courseId: t.course_id,
            commander: t.commander ?? undefined,
            commanderRank: t.commander_rank ?? undefined,
            commanderContact: t.commander_contact ?? undefined,
            subCommander1: t.sub_commander_1 ?? t.sub_commander ?? undefined,
            subCommander1Rank: t.sub_commander_1_rank ?? t.sub_commander_rank ?? undefined,
            subCommander1Contact: t.sub_commander_1_contact ?? t.sub_commander_contact ?? undefined,
            subCommander2: t.sub_commander_2 ?? undefined,
            subCommander2Rank: t.sub_commander_2_rank ?? undefined,
            subCommander2Contact: t.sub_commander_2_contact ?? undefined,
            subCommander3: t.sub_commander_3 ?? undefined,
            subCommander3Rank: t.sub_commander_3_rank ?? undefined,
            subCommander3Contact: t.sub_commander_3_contact ?? undefined,
          }));

          parsedTeams.sort((a, b) => {
            const getOrder = (teamName: string) => {
              const match = teamName.match(/(\d+)(?!.*\d)/);
              return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
            };
            return getOrder(a.name) - getOrder(b.name);
          });

          setTeams(parsedTeams);
          return;
        }
      }
    } catch (error) {
      console.warn('Teams load failed, using fallback data:', error);
    }

    const fallbackTeams = TEAMS.filter((team) => team.courseId === courseId);
    const sortedFallback = [...fallbackTeams].sort((a, b) => {
      const getOrder = (teamName: string) => {
        const match = teamName.match(/(\d+)(?!.*\d)/);
        return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
      };
      return getOrder(a.name) - getOrder(b.name);
    });
    setTeams(sortedFallback);
  };

  if (selectedTeam) {
    return (
      <StudentTable 
        teamId={selectedTeam} 
        onBack={() => setSelectedTeam(null)} 
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Taqımlar</h2>
        <p className="text-muted-foreground">Taqımı seçin və kursantları görüntüləyin</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="transition-all hover:shadow-glow hover:scale-105 border-border bg-card relative group"
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoTeam(team);
                }}
              >
                <Info className="h-4 w-4" />
              </Button>
              
              <div 
                className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow cursor-pointer"
                onClick={() => setSelectedTeam(team.id)}
              >
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setSelectedTeam(team.id)}
              >
                <h3 className="font-semibold text-foreground">{team.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {team.commander || "Komandir təyin edilməyib"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {infoTeam && (
        <TeamInfoModal
          team={infoTeam}
          onClose={() => setInfoTeam(null)}
        />
      )}
    </div>
  );
};

export default TeamGrid;
