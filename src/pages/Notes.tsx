import React, { useState } from "react";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { filterNotes } from "@/lib/studyLogic";
import { useStudy } from "@/store/StudyContext";
import { useToast } from "@/hooks/use-toast";

const Notes: React.FC = () => {
  const { state, createNote, updateNote, deleteNote } = useStudy();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState("all");
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    state.notes[0]?.id || ""
  );

  const visibleNotes = filterNotes(state.notes, searchQuery, goalFilter);
  const activeNote =
    state.notes.find((n) => n.id === selectedNoteId) || visibleNotes[0];

  const handleNewNote = () => {
    const created = createNote({
      title: "Untitled Study Note",
      content: "",
      goalId: goalFilter !== "all" ? goalFilter : undefined,
      tags: [],
    });
    setSelectedNoteId(created.id);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    const remaining = state.notes.filter((n) => n.id !== id);
    setSelectedNoteId(remaining[0]?.id || "");
    toast({ title: "Note deleted" });
  };

  const wordCount = activeNote
    ? activeNote.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <AppShell hideFooter>
      <div className="mx-auto flex h-[calc(100vh-61px)] max-w-6xl flex-col md:flex-row">
        {/* Left Sidebar: Notes Index */}
        <aside className="w-full shrink-0 border-b border-[#1E2323] bg-[#070808] p-4 md:w-80 md:border-b-0 md:border-r flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-heading text-lg font-bold text-[#D6E3E4]">
              Notebook
            </h1>
            <button
              type="button"
              onClick={handleNewNote}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#31CB53] px-3 py-2 text-xs font-semibold text-black hover:bg-[#29b347]"
            >
              <Plus className="h-3.5 w-3.5" />
              New Note
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3A5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                aria-label="Search study notes"
                className="w-full rounded-lg border border-[#232929] bg-black py-2 pl-9 pr-3 text-xs text-[#D6E3E4] placeholder:text-[#667375] focus:border-[#31CB53] focus:outline-none"
              />
            </div>

            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              aria-label="Filter notes by goal"
              className="w-full rounded-lg border border-[#232929] bg-black px-3 py-2 text-xs text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
            >
              <option value="all">All Goals ({state.notes.length})</option>
              {state.goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto space-y-1.5 max-h-48 md:max-h-none">
            {visibleNotes.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-[#94A3A5]">
                No notes match your search.
              </p>
            ) : (
              visibleNotes.map((note) => {
                const isSelected = note.id === activeNote?.id;
                const linkedGoal = state.goals.find((g) => g.id === note.goalId);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-[#D6E3E4] text-black"
                        : "text-[#D6E3E4] hover:bg-[#0E1111]"
                    }`}
                  >
                    <p className="truncate text-sm font-semibold">
                      {note.title || "Untitled Study Note"}
                    </p>
                    <p
                      className={`mt-0.5 truncate text-xs ${
                        isSelected ? "text-[#2A3435]" : "text-[#94A3A5]"
                      }`}
                    >
                      {linkedGoal ? linkedGoal.title : "General"} ·{" "}
                      <span className="font-mono tabular-nums">
                        {note.updatedAt}
                      </span>
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Distraction-Free Note Editor */}
        <section className="flex flex-1 flex-col bg-black min-w-0">
          {activeNote ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2323] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <label htmlFor="note-goal-link" className="text-xs text-[#94A3A5]">
                    Linked Goal:
                  </label>
                  <select
                    id="note-goal-link"
                    value={activeNote.goalId || ""}
                    onChange={(e) =>
                      updateNote(activeNote.id, {
                        goalId: e.target.value || undefined,
                      })
                    }
                    className="rounded-lg border border-[#232929] bg-[#0B0D0D] px-2.5 py-1.5 text-xs text-[#D6E3E4] focus:border-[#31CB53] focus:outline-none"
                  >
                    <option value="">General Note</option>
                    {state.goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs tabular-nums text-[#94A3A5]">
                    {wordCount} words
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(activeNote.id)}
                    aria-label={`Delete note ${activeNote.title}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#94A3A5] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-8 overflow-y-auto">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) =>
                    updateNote(activeNote.id, { title: e.target.value })
                  }
                  placeholder="Note title..."
                  aria-label="Note title"
                  className="w-full bg-transparent font-heading text-2xl font-extrabold text-[#D6E3E4] placeholder:text-[#4F5A5C] focus:outline-none sm:text-3xl"
                />

                <textarea
                  value={activeNote.content}
                  onChange={(e) =>
                    updateNote(activeNote.id, { content: e.target.value })
                  }
                  placeholder="Write your concepts, mental models, formulas, or code snippets here..."
                  aria-label="Note content"
                  className="mt-5 flex-1 w-full resize-none bg-transparent text-base leading-relaxed text-[#D6E3E4] placeholder:text-[#4F5A5C] focus:outline-none"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <FileText className="h-10 w-10 text-[#94A3A5]" />
              <h2 className="mt-4 font-heading text-xl font-bold text-[#D6E3E4]">
                No note selected
              </h2>
              <p className="mt-1 text-sm text-[#94A3A5]">
                Create a new study note to start capturing your takeaways.
              </p>
              <button
                type="button"
                onClick={handleNewNote}
                className="mt-5 rounded-lg bg-[#31CB53] px-5 py-2.5 text-sm font-semibold text-black"
              >
                Create First Note
              </button>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
};

export default Notes;
