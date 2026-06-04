// "use client"

// import { useState } from "react"
// import { Music, Plus, X, Youtube } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import type { LibrarySong, Pitch, KeyQuality } from "@/lib/types"

// const PITCHES: Pitch[] = [
//   "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
// ]

// const TIME_SIGNATURES = ["4/4", "3/4", "6/8", "12/8", "2/4", "5/4"]

// const COMMON_THEMES = [
//   "worship",
//   "praise",
//   "thanksgiving",
//   "communion",
//   "christmas",
//   "easter",
//   "salvation",
//   "grace",
//   "faithfulness",
//   "hope",
//   "love",
//   "jesus",
//   "cross",
//   "resurrection",
// ]

// interface AddSongModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   orgId: string
//   onSongAdded?: (song: LibrarySong) => void
// }

// export function AddSongModal({
//   open,
//   onOpenChange,
//   orgId,
//   onSongAdded,
// }: AddSongModalProps) {
//   const [title, setTitle] = useState("")
//   const [artist, setArtist] = useState("")
//   const [bpm, setBpm] = useState<string>("")
//   const [timeSignature, setTimeSignature] = useState("4/4")
//   const [defaultPitch, setDefaultPitch] = useState<Pitch | "none">("none")
//   const [defaultKeyQuality, setDefaultKeyQuality] = useState<KeyQuality | "none">("major")
//   const [spotifyUrl, setSpotifyUrl] = useState("")
//   const [youtubeUrl, setYoutubeUrl] = useState("")
//   const [themes, setThemes] = useState<string[]>([])
//   const [themeInput, setThemeInput] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const reset = () => {
//     setTitle("")
//     setArtist("")
//     setBpm("")
//     setTimeSignature("4/4")
//     setDefaultPitch("none")
//     setDefaultKeyQuality("major")
//     setSpotifyUrl("")
//     setYoutubeUrl("")
//     setThemes([])
//     setThemeInput("")
//   }

//   const handleClose = (next: boolean) => {
//     if (!next) reset()
//     onOpenChange(next)
//   }

//   const addTheme = (raw: string) => {
//     const value = raw.trim().toLowerCase()
//     if (!value) return
//     if (themes.includes(value)) return
//     setThemes((prev) => [...prev, value])
//     setThemeInput("")
//   }

//   const removeTheme = (value: string) => {
//     setThemes((prev) => prev.filter((t) => t !== value))
//   }

//   const handleThemeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault()
//       addTheme(themeInput)
//     } else if (e.key === "Backspace" && themeInput === "" && themes.length > 0) {
//       setThemes((prev) => prev.slice(0, -1))
//     }
//   }

//   const isValid = title.trim() !== "" && artist.trim() !== "" && bpm !== ""

//   const handleSubmit = async () => {
//     if (!isValid) return
//     setIsSubmitting(true)

//     const newSong: LibrarySong = {
//       id: `song-${Date.now()}`,
//       title: title.trim(),
//       artist: artist.trim(),
//       bpm: Number.parseInt(bpm, 10),
//       timeSignature,
//       defaultPitch: defaultPitch === "none" ? null : defaultPitch,
//       defaultKeyQuality:
//         defaultPitch === "none" || defaultKeyQuality === "none"
//           ? null
//           : defaultKeyQuality,
//       spotifyUrl: spotifyUrl.trim() || null,
//       youtubeUrl: youtubeUrl.trim() || null,
//       themes,
//       organizationId: orgId,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     onSongAdded?.(newSong)
//     setIsSubmitting(false)
//     handleClose(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
//               <Music className="h-4 w-4" />
//             </span>
//             Add a song
//           </DialogTitle>
//           <DialogDescription>
//             Add a song to your library so anyone on the team can find it when
//             building setlists.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-5 py-2">
//           {/* Required fields */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="sm:col-span-2 space-y-1.5">
//               <Label htmlFor="song-title">
//                 Title <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="song-title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="What a Beautiful Name"
//                 autoFocus
//               />
//             </div>

//             <div className="sm:col-span-2 space-y-1.5">
//               <Label htmlFor="song-artist">
//                 Artist <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="song-artist"
//                 value={artist}
//                 onChange={(e) => setArtist(e.target.value)}
//                 placeholder="Hillsong Worship"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="song-bpm">
//                 BPM <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="song-bpm"
//                 type="number"
//                 inputMode="numeric"
//                 min={20}
//                 max={300}
//                 value={bpm}
//                 onChange={(e) => setBpm(e.target.value)}
//                 placeholder="68"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="song-time">Time signature</Label>
//               <Select value={timeSignature} onValueChange={setTimeSignature}>
//                 <SelectTrigger id="song-time">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TIME_SIGNATURES.map((ts) => (
//                     <SelectItem key={ts} value={ts}>
//                       {ts}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Default key */}
//           <div className="space-y-1.5">
//             <Label>Default key</Label>
//             <div className="grid grid-cols-2 gap-2">
//               <Select
//                 value={defaultPitch}
//                 onValueChange={(v) => setDefaultPitch(v as Pitch | "none")}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Pitch" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">No default</SelectItem>
//                   {PITCHES.map((p) => (
//                     <SelectItem key={p} value={p}>
//                       {p}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={defaultKeyQuality}
//                 onValueChange={(v) =>
//                   setDefaultKeyQuality(v as KeyQuality | "none")
//                 }
//                 disabled={defaultPitch === "none"}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Quality" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="major">Major</SelectItem>
//                   <SelectItem value="minor">Minor</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Used as a starting point in setlists; team members can transpose
//               per event.
//             </p>
//           </div>

//           {/* Links */}
//           <div className="space-y-3">
//             <Label>Reference links</Label>
//             <div className="space-y-2">
//               <div className="relative">
//                 <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
//                   <svg
//                     viewBox="0 0 24 24"
//                     className="h-4 w-4 fill-current"
//                     aria-hidden="true"
//                   >
//                     <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0Zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02Zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2Zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.561.3Z" />
//                   </svg>
//                 </span>
//                 <Input
//                   value={spotifyUrl}
//                   onChange={(e) => setSpotifyUrl(e.target.value)}
//                   placeholder="Spotify URL"
//                   className="pl-9"
//                 />
//               </div>
//               <div className="relative">
//                 <Youtube className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   value={youtubeUrl}
//                   onChange={(e) => setYoutubeUrl(e.target.value)}
//                   placeholder="YouTube URL"
//                   className="pl-9"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Themes */}
//           <div className="space-y-2">
//             <Label htmlFor="song-themes">Themes</Label>
//             <div className="rounded-md border bg-background p-2">
//               <div className="flex flex-wrap gap-1.5">
//                 {themes.map((theme) => (
//                   <Badge
//                     key={theme}
//                     variant="secondary"
//                     className="gap-1 pl-2 pr-1 capitalize"
//                   >
//                     {theme}
//                     <button
//                       type="button"
//                       onClick={() => removeTheme(theme)}
//                       className="ml-0.5 rounded-sm p-0.5 transition-colors hover:bg-foreground/10"
//                       aria-label={`Remove ${theme}`}
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 ))}
//                 <input
//                   id="song-themes"
//                   value={themeInput}
//                   onChange={(e) => setThemeInput(e.target.value)}
//                   onKeyDown={handleThemeKeyDown}
//                   onBlur={() => themeInput && addTheme(themeInput)}
//                   placeholder={themes.length === 0 ? "Add a theme..." : ""}
//                   className="flex-1 min-w-[120px] bg-transparent px-2 py-0.5 text-sm outline-none"
//                 />
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-1.5">
//               {COMMON_THEMES.filter((t) => !themes.includes(t))
//                 .slice(0, 8)
//                 .map((suggestion) => (
//                   <button
//                     key={suggestion}
//                     type="button"
//                     onClick={() => addTheme(suggestion)}
//                     className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs capitalize text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
//                   >
//                     <Plus className="h-3 w-3" />
//                     {suggestion}
//                   </button>
//                 ))}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Press Enter or comma to add. Themes help your team filter the
//               library when planning a service.
//             </p>
//           </div>
//         </div>

//         <DialogFooter className="gap-2 sm:gap-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => handleClose(false)}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="button"
//             onClick={handleSubmit}
//             disabled={!isValid || isSubmitting}
//             className="gap-1.5"
//           >
//             <Plus className="h-4 w-4" />
//             {isSubmitting ? "Adding..." : "Add song"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
