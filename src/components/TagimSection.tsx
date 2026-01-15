import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Edit2, User, Award, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = "http://localhost:4000/api";

interface TagimItem {
  id?: number;
  title: string;
  content: string;
}

const TagimSection = () => {
  const { toast } = useToast();
  const [tags, setTags] = useState<TagimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagimItem | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTags(data || []);
      }
    } catch (error) {
      console.error("Error loading tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let res;
      
      if (editingTag?.id) {
        // Update
        res = await fetch(`${API_URL}/tags/${editingTag.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create
        res = await fetch(`${API_URL}/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Xəta baş verdi");
      }

      toast({
        title: "Uğurlu",
        description: editingTag ? "Tagim yeniləndi" : "Tagim əlavə olundu",
      });
      setShowAddModal(false);
      setEditingTag(null);
      setFormData({ title: "", content: "" });
      loadTags();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Tagim əlavə/yenilə zamanı xəta baş verdi",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tags/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast({
          title: "Uğurlu",
          description: "Tagim silindi",
        });
        loadTags();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Tagim silinərkən xəta baş verdi",
      });
    }
  };

  const openEditModal = (tag: TagimItem) => {
    setEditingTag(tag);
    setFormData({ title: tag.title || "", content: tag.content || "" });
    setShowAddModal(true);
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Yüklənir...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tagim</h2>
          <p className="text-sm text-muted-foreground">Tagim komandiri və digər məlumatlar</p>
        </div>
        <Button onClick={() => { setEditingTag(null); setFormData({ title: "", content: "" }); setShowAddModal(true); }} className="gap-2">
          <Plus className="w-4 h-4" />
          Əlavə et
        </Button>
      </div>

      <ScrollArea className="h-[500px] w-full rounded-md border border-border p-4">
        <div className="space-y-3">
          {tags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Hələ heç bir tagim məlumatı əlavə edilməyib
            </div>
          ) : (
            tags.map((tag) => (
              <Card key={tag.id} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{tag.title}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{tag.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(tag)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => tag.id && handleDelete(tag.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {showAddModal && (
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-lg max-h-[70vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingTag ? "Tagim redaktə et" : "Yeni Tagim əlavə et"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Başlıq</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Məsələn: Tagim Komandiri"
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Məzmun</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tagim haqqında məlumat..."
                    rows={6}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="flex justify-end gap-2 pb-2">
                  <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setEditingTag(null); }}>
                    Ləğv et
                  </Button>
                  <Button type="submit">{editingTag ? "Yenilə" : "Əlavə et"}</Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TagimSection;

