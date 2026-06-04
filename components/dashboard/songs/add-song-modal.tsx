"use client"

import { useState } from "react";
import { Music, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { YoutubeIcon, SpotifyIcon } from "@/components/icons/brand-icons";

import { Pitch, KeyQuality } from "@/generated/prisma/enums";


const PITCH_LABELS: Record<Pitch, string> = {
  C: "C",
  C_SHARP: "C♯",
  D_FLAT: "D♭",
  D: "D",
  D_SHARP: "D♯",
  E_FLAT: "E♭",
  E: "E",
  F: "F",
  F_SHARP: "F♯",
  G_FLAT: "G♭",
  G: "G",
  G_SHARP: "G♯",
  A_FLAT: "A♭",
  A: "A",
  A_SHARP: "A♯",
  B_FLAT: "B♭",
  B: "B",
} as const


const TIME_SIGNATURES = ["4/4", "3/4", "6/8", "12/8", "2/4", "5/4"];

const COMMON_THEMES = [
  "worship",
  "praise",
  "thanksgiving",
  "communion",
  "christmas",
  "easter",
  "salvation",
  "grace",
  "faithfulness",
  "hope",
  "love",
  "jesus",
  "cross",
  "resurrection",
];

type Song = {
    id: string
    organizationId: string
    title: string
    artist: string
    bpm: number
    timeSignature: string
    defaultPitch: Pitch | null
    defaultKeyQuality: KeyQuality | null
    spotifyUrl: string | null
    youtubeUrl: string | null
    themes: string[]
};

interface AddSongModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orgId: string
  onSongAdded?: (song: Song) => void
};

export function AddSongModal({
  open,
  onOpenChange,
  orgId,
  onSongAdded,
}: AddSongModalProps) {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [bpm, setBpm] = useState<string>("")
  const [timeSignature, setTimeSignature] = useState("4/4")
  const [defaultPitch, setDefaultPitch] = useState<Pitch | "none">("none")
  const [defaultKeyQuality, setDefaultKeyQuality] = useState<KeyQuality | "none">(KeyQuality.MAJOR)
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [themes, setThemes] = useState<string[]>([])
  const [themeInput, setThemeInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reset = () => {
    setTitle("")
    setArtist("")
    setBpm("")
    setTimeSignature("4/4")
    setDefaultPitch("none")
    setDefaultKeyQuality(KeyQuality.MAJOR)
    setSpotifyUrl("")
    setYoutubeUrl("")
    setThemes([])
    setThemeInput("")
  }

  const handleClose = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const addTheme = (raw: string) => {
    const value = raw.trim().toLowerCase()
    if (!value) return
    if (themes.includes(value)) return
    setThemes((prev) => [...prev, value])
    setThemeInput("")
  }

  const removeTheme = (value: string) => {
    setThemes((prev) => prev.filter((t) => t !== value))
  }

  const handleThemeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTheme(themeInput)
    } else if (e.key === "Backspace" && themeInput === "" && themes.length > 0) {
      setThemes((prev) => prev.slice(0, -1))
    }
  }

  const isValid = title.trim() !== "" && artist.trim() !== "" && bpm !== ""

  const handleSubmit = async () => {
   

    console.log("entering song");

    
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-140 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Music className="h-4 w-4" />
            </span>
            Add a song
          </DialogTitle>
          <DialogDescription>
            Add a song to your library so anyone on the team can find it when
            building setlists.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Required fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="song-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="song-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What a Beautiful Name"
                autoFocus
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="song-artist">
                Artist <span className="text-destructive">*</span>
              </Label>
              <Input
                id="song-artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Hillsong Worship"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="song-bpm">
                BPM <span className="text-destructive">*</span>
              </Label>
              <Input
                id="song-bpm"
                type="number"
                inputMode="numeric"
                min={20}
                max={300}
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="68"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="song-time">Time signature</Label>
              <Select value={timeSignature} onValueChange={setTimeSignature}>
                <SelectTrigger id="song-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SIGNATURES.map((ts) => (
                    <SelectItem key={ts} value={ts}>
                      {ts}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Default key */}
          <div className="space-y-1.5">
            <Label>Default key</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={defaultPitch}
                onValueChange={(v) => setDefaultPitch(v as Pitch | "none")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pitch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No default</SelectItem>
                  {Object.values(Pitch).map((pitch) => (
                    <SelectItem key={pitch} value={pitch}>
                      {PITCH_LABELS[pitch]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={defaultKeyQuality}
                onValueChange={(v) =>
                  setDefaultKeyQuality(v as KeyQuality | "none")
                }
                disabled={defaultPitch === "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Used as a starting point in setlists; team members can transpose
              per event.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Label>Reference links</Label>
            <div className="space-y-2">
              <div className="relative">
                <SpotifyIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="Spotify URL"
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <YoutubeIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="YouTube URL"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Themes */}
          <div className="space-y-2">
            <Label htmlFor="song-themes">Themes</Label>
            <div className="rounded-md border bg-background p-2">
              <div className="flex flex-wrap gap-1.5">
                {themes.map((theme) => (
                  <Badge
                    key={theme}
                    variant="secondary"
                    className="gap-1 pl-2 pr-1 capitalize"
                  >
                    {theme}
                    <button
                      type="button"
                      onClick={() => removeTheme(theme)}
                      className="ml-0.5 rounded-sm p-0.5 transition-colors hover:bg-foreground/10"
                      aria-label={`Remove ${theme}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  id="song-themes"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  onKeyDown={handleThemeKeyDown}
                  onBlur={() => themeInput && addTheme(themeInput)}
                  placeholder={themes.length === 0 ? "Add a theme..." : ""}
                  className="flex-1 min-w-30 bg-transparent px-2 py-0.5 text-sm outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_THEMES.filter((t) => !themes.includes(t))
                .slice(0, 8)
                .map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTheme(suggestion)}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs capitalize text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    {suggestion}
                  </button>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add. Themes help your team filter the
              library when planning a service.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
