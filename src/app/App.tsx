import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Home, Bookmark, User, Heart, Download, Share2, Plus,
  Bell, X, Settings, Sparkles, MessageCircle, Eye, EyeOff,
  ArrowRight, Check, ChevronRight,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type AppStage = "splash" | "onboarding" | "auth" | "interests" | "main";
type AuthMode = "login" | "signup";
type View = "home" | "search" | "saved" | "profile";

interface Post {
  id: string; imageId: string; title: string; author: string;
  initial: string; likes: number; category: string; aspect: string; desc: string;
}
interface Board { id: string; name: string; count: number; coverId: string; }

// ── Data ───────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All", "Bags", "Shoes", "Loafers", "Clothes",
  "Hair Braids", "Makeup", "Flowers", "DIY Crafts", "Accessories", "Home Décor",
];

const INTEREST_OPTIONS = [
  { id: "bags",     label: "Bags",       emoji: "👜", imageId: "1683921590274-a83862cb11c3" },
  { id: "shoes",    label: "Shoes",      emoji: "👠", imageId: "1682364853446-db043f643207" },
  { id: "clothes",  label: "Clothes",    emoji: "👗", imageId: "1766238955752-0200601334ed" },
  { id: "makeup",   label: "Makeup",     emoji: "💄", imageId: "1503236823255-94609f598e71" },
  { id: "hair",     label: "Hair Braids",emoji: "💇", imageId: "1527633412983-d80af308e660" },
  { id: "flowers",  label: "Flowers",    emoji: "🌸", imageId: "1574271143515-5cddf8da19be" },
  { id: "diy",      label: "DIY Crafts", emoji: "🎨", imageId: "1589557313308-3b0dde4a7103" },
  { id: "accessor", label: "Accessories",emoji: "💍", imageId: "1777462985111-9da64fb2e6e6" },
  { id: "homedecor",label: "Home Décor", emoji: "🏠", imageId: "1676570092589-a6c09ecbb373" },
  { id: "loafers",  label: "Loafers",    emoji: "🥿", imageId: "1761896898277-5141377f2a12" },
];

const ONBOARDING_SLIDES = [
  {
    imageId: "1766238955752-0200601334ed",
    title: "Discover Your Style",
    body: "Explore millions of fashion ideas curated just for you — from runway looks to everyday elegance.",
  },
  {
    imageId: "1683921590274-a83862cb11c3",
    title: "Save What You Love",
    body: "Bookmark any pin to your personal boards and build a wardrobe of inspiration that's always with you.",
  },
  {
    imageId: "1527633412983-d80af308e660",
    title: "Create & Share",
    body: "Build gorgeous mood boards, share your style, and connect with a community of creators like you.",
  },
];

const POSTS: Post[] = [
  { id: "1",  imageId: "1766238955752-0200601334ed", title: "Pink Spring Aesthetic",  author: "sophiastyle",   initial: "S", likes: 1247, category: "Clothes",     aspect: "aspect-[2/3]",  desc: "Pastel pink outfit for spring, paired with floral accessories and soft blush tones." },
  { id: "2",  imageId: "1683921590274-a83862cb11c3", title: "Blushing Beauty Bag",    author: "luxe.petra",    initial: "L", likes: 892,  category: "Bags",         aspect: "aspect-[3/4]",  desc: "Soft pink mini bag perfect for every occasion. A must-have accessory this season." },
  { id: "3",  imageId: "1503236823255-94609f598e71", title: "Soft Glam Makeup",       author: "glowbygrace",   initial: "G", likes: 2103, category: "Makeup",       aspect: "aspect-square", desc: "Achieve the softest glam look with blush tones and rosy pigments." },
  { id: "4",  imageId: "1777462985111-9da64fb2e6e6", title: "Light Pink Blouse",      author: "miamoda",       initial: "M", likes: 744,  category: "Clothes",      aspect: "aspect-[3/4]",  desc: "Flowy tie-waist blouse in the softest blush pink. Perfect for any occasion." },
  { id: "5",  imageId: "1685800750376-f4497f5da428", title: "Pink Duo Statement",     author: "bagobsessed",   initial: "B", likes: 1567, category: "Bags",         aspect: "aspect-[2/3]",  desc: "Two statement pink bags showcasing the power of monochromatic styling." },
  { id: "6",  imageId: "1625093742435-6fa192b6fb10", title: "Berry Lip Moment",       author: "beautyrose",    initial: "B", likes: 3210, category: "Makeup",       aspect: "aspect-[3/4]",  desc: "Deep berry lips are the ultimate statement. Rich, bold, unforgettable." },
  { id: "7",  imageId: "1682628890923-e0d08e2e51f9", title: "Dusty Rose Clutch",      author: "luxe.petra",    initial: "L", likes: 988,  category: "Bags",         aspect: "aspect-square", desc: "Dusty rose mini clutch with metallic accents — elevated minimalism at its finest." },
  { id: "8",  imageId: "1761896898277-5141377f2a12", title: "Embroidered Elegance",   author: "stylenotes",    initial: "S", likes: 1432, category: "Loafers",      aspect: "aspect-[2/3]",  desc: "Striped shirt with embroidered flowers and classic loafers — a timeless combination." },
  { id: "9",  imageId: "1527633412983-d80af308e660", title: "Chanel Glow Set",        author: "glowbygrace",   initial: "G", likes: 4520, category: "Makeup",       aspect: "aspect-[3/4]",  desc: "The iconic Chanel makeup set for a luminous, all-day glow." },
  { id: "10", imageId: "1589557313308-3b0dde4a7103", title: "Gold Hour Details",      author: "accessorychic", initial: "A", likes: 671,  category: "Accessories",  aspect: "aspect-square", desc: "A gold analog watch on white linen — because details make the outfit." },
  { id: "11", imageId: "1574271143515-5cddf8da19be", title: "Pink Leather Love",      author: "bagobsessed",   initial: "B", likes: 1899, category: "Bags",         aspect: "aspect-[2/3]",  desc: "A structured pink leather bag that transforms any look into a statement." },
  { id: "12", imageId: "1682364853446-db043f643207", title: "Shoes & Bag Duo",        author: "luxe.petra",    initial: "L", likes: 2344, category: "Shoes",        aspect: "aspect-[3/4]",  desc: "Matching shoes and bag in warm tones — the art of coordinated accessories." },
  { id: "13", imageId: "1632469188022-b5db09a70fbc", title: "Cozy Autumn Edit",       author: "wardrobegoals", initial: "W", likes: 1123, category: "Clothes",      aspect: "aspect-square", desc: "Cozy autumn flat lay featuring earthy tones and layered textures." },
  { id: "14", imageId: "1676570092589-a6c09ecbb373", title: "Vanity Collection",      author: "beautyrose",    initial: "B", likes: 876,  category: "Home Décor",   aspect: "aspect-[3/4]",  desc: "A curated vanity collection in soft pinks and nudes." },
];

const INITIAL_BOARDS: Board[] = [
  { id: "b1", name: "Summer Wardrobe",  count: 48, coverId: "1766238955752-0200601334ed" },
  { id: "b2", name: "Bag Collection",   count: 32, coverId: "1683921590274-a83862cb11c3" },
  { id: "b3", name: "Makeup Inspo",     count: 67, coverId: "1503236823255-94609f598e71" },
  { id: "b4", name: "Accessories Edit", count: 21, coverId: "1589557313308-3b0dde4a7103" },
  { id: "b5", name: "Style Goals",      count: 55, coverId: "1761896898277-5141377f2a12" },
  { id: "b6", name: "Dream Shoes",      count: 18, coverId: "1682364853446-db043f643207" },
];

const TRENDING = [
  "pink aesthetic", "summer outfit ideas", "berry makeup look",
  "minimal bags", "hair braiding styles", "DIY flower wall",
  "loafers outfit", "home décor inspo",
];

const NOTIFS = [
  { user: "luxe.petra",    action: "liked your pin",                         time: "2m",  initial: "L" },
  { user: "glowbygrace",   action: "started following you",                  time: "15m", initial: "G" },
  { user: "sophiastyle",   action: "saved your pin to Summer Vibes",         time: "1h",  initial: "S" },
  { user: "miamoda",       action: 'commented: "Obsessed with this look!"',  time: "3h",  initial: "M" },
  { user: "bagobsessed",   action: "liked your Bag Collection board",        time: "5h",  initial: "B" },
  { user: "accessorychic", action: "mentioned you in a comment",             time: "8h",  initial: "A" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;

function img(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
}
function fmtNum(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }
function stableVal(id: string, mod: number, add: number) {
  return (id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 37) % mod + add;
}

// ── Shared UI ──────────────────────────────────────────────────────────────
function Av({ initial, size = "sm" }: { initial: string; size?: "xs" | "sm" | "md" | "lg" }) {
  const cls = { xs: "w-4 h-4 text-[8px]", sm: "w-5 h-5 text-[9px]", md: "w-9 h-9 text-sm", lg: "w-16 h-16 text-2xl" }[size];
  return (
    <div className={`${cls} rounded-full bg-accent flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initial}
    </div>
  );
}

function PrimaryBtn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick}
      className={`w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-md shadow-primary/25 ${className}`}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full border border-border text-foreground font-medium py-3.5 rounded-2xl transition-all hover:bg-secondary/40 active:scale-[0.98]">
      {children}
    </button>
  );
}

// ── Stage: Splash ──────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F8D7E5 0%, #FDEEF5 50%, #E8C5D8 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-16 right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-24 left-6 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center"
      >
        {/* Logo mark */}
        <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center shadow-xl shadow-primary/30 mb-5">
          <svg viewBox="0 0 40 40" className="w-11 h-11 fill-white">
            <path d="M20 4C11.16 4 4 11.16 4 20c0 7.18 4.72 13.26 11.24 15.3-.15-1.38-.3-3.52.06-5.03.33-1.36 2.2-9.34 2.2-9.34s-.56-1.12-.56-2.78c0-2.6 1.51-4.56 3.38-4.56 1.6 0 2.37 1.2 2.37 2.63 0 1.6-1.02 4.01-1.55 6.23-.44 1.86.93 3.37 2.76 3.37 3.31 0 5.86-3.49 5.86-8.53 0-4.46-3.2-7.58-7.78-7.58-5.3 0-8.4 3.97-8.4 8.08 0 1.6.62 3.31 1.38 4.25.15.18.17.34.13.53-.14.58-.45 1.86-.51 2.12-.08.34-.27.41-.62.25-2.32-1.08-3.77-4.5-3.77-7.23 0-5.88 4.27-11.28 12.32-11.28 6.47 0 11.5 4.61 11.5 10.77 0 6.42-4.05 11.59-9.66 11.59-1.89 0-3.66-.98-4.27-2.14l-1.16 4.33c-.42 1.62-1.55 3.65-2.31 4.88.87.27 1.79.41 2.74.41 8.84 0 16-7.16 16-16S28.84 4 20 4z"/>
          </svg>
        </div>
        <h1 className="text-[38px] font-bold text-primary tracking-tight" style={serif}>PinPetra</h1>
        <p className="text-sm text-muted-foreground mt-1 tracking-wide">Your style, your inspiration</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-16 flex gap-2"
      >
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }} />
        ))}
      </motion.div>
    </div>
  );
}

// ── Stage: Onboarding ──────────────────────────────────────────────────────
function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0);
  const s = ONBOARDING_SLIDES[slide];
  const last = slide === ONBOARDING_SLIDES.length - 1;

  const next = () => last ? onDone() : setSlide(v => v + 1);

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      {/* Image area */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide}
            src={img(s.imageId, 800, 900)}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background" />

        {/* Skip */}
        {!last && (
          <button onClick={onDone}
            className="absolute top-5 right-5 text-white/80 text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            Skip
          </button>
        )}
      </div>

      {/* Text + controls */}
      <div className="px-7 pb-10 pt-5">
        <AnimatePresence mode="wait">
          <motion.div key={slide}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            <h2 className="text-[26px] font-bold text-foreground leading-tight mb-2" style={serif}>{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-5 mb-6">
          {ONBOARDING_SLIDES.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === slide ? 24 : 8, opacity: i === slide ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full bg-primary cursor-pointer"
              onClick={() => setSlide(i)} />
          ))}
        </div>

        <PrimaryBtn onClick={next}>
          <span className="flex items-center justify-center gap-2">
            {last ? "Get Started" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </span>
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ── Stage: Auth ────────────────────────────────────────────────────────────
function AuthScreen({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(v => ({ ...v, [k]: e.target.value }));

  return (
    <div className="absolute inset-0 flex flex-col bg-background overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Header image strip */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden">
        <div className="flex h-full">
          {["1766238955752-0200601334ed", "1683921590274-a83862cb11c3", "1503236823255-94609f598e71"].map(id => (
            <img key={id} src={img(id, 300, 350)} alt="" className="flex-1 object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <svg viewBox="0 0 40 40" className="w-8 h-8 fill-white">
              <path d="M20 4C11.16 4 4 11.16 4 20c0 7.18 4.72 13.26 11.24 15.3-.15-1.38-.3-3.52.06-5.03.33-1.36 2.2-9.34 2.2-9.34s-.56-1.12-.56-2.78c0-2.6 1.51-4.56 3.38-4.56 1.6 0 2.37 1.2 2.37 2.63 0 1.6-1.02 4.01-1.55 6.23-.44 1.86.93 3.37 2.76 3.37 3.31 0 5.86-3.49 5.86-8.53 0-4.46-3.2-7.58-7.78-7.58-5.3 0-8.4 3.97-8.4 8.08 0 1.6.62 3.31 1.38 4.25.15.18.17.34.13.53-.14.58-.45 1.86-.51 2.12-.08.34-.27.41-.62.25-2.32-1.08-3.77-4.5-3.77-7.23 0-5.88 4.27-11.28 12.32-11.28 6.47 0 11.5 4.61 11.5 10.77 0 6.42-4.05 11.59-9.66 11.59-1.89 0-3.66-.98-4.27-2.14l-1.16 4.33c-.42 1.62-1.55 3.65-2.31 4.88.87.27 1.79.41 2.74.41 8.84 0 16-7.16 16-16S28.84 4 20 4z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 pb-8">
        <h2 className="text-2xl font-bold text-foreground text-center mb-1" style={serif}>
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signup" ? "Join PinPetra and start collecting inspiration" : "Sign in to continue your style journey"}
        </p>

        {/* Toggle */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          {(["signup", "login"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {m === "signup" ? "Sign Up" : "Log In"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === "signup" && (
            <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input value={form.name} onChange={set("name")} placeholder="Full name"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            </div>
          )}
          <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-xl px-4 py-3">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground flex-shrink-0 fill-none stroke-current" strokeWidth={2}>
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input value={form.email} onChange={set("email")} type="email" placeholder="Email address"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-xl px-4 py-3">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground flex-shrink-0 fill-none stroke-current" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input value={form.password} onChange={set("password")} type={showPass ? "text" : "password"} placeholder="Password"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            <button onClick={() => setShowPass(v => !v)}>
              {showPass ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {mode === "login" && (
          <button className="text-xs text-primary font-medium mt-2 w-full text-right">Forgot password?</button>
        )}

        <div className="mt-5 space-y-3">
          <PrimaryBtn onClick={onDone}>
            {mode === "signup" ? "Create Account" : "Sign In"}
          </PrimaryBtn>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <GhostBtn onClick={onDone}>
            <span className="flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </span>
          </GhostBtn>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          By continuing you agree to PinPetra&apos;s{" "}
          <span className="text-primary underline underline-offset-2">Terms</span> &amp;{" "}
          <span className="text-primary underline underline-offset-2">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

// ── Stage: Interests ───────────────────────────────────────────────────────
function InterestsScreen({ onDone }: { onDone: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const canContinue = selected.size >= 3;

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      <div className="px-6 pt-8 pb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mb-4">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[24px] font-bold text-foreground leading-tight" style={serif}>
          What inspires you?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pick at least 3 categories to personalise your feed.
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full"
              animate={{ width: `${Math.min((selected.size / 3) * 100, 100)}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }} />
          </div>
          <span className="text-xs text-muted-foreground min-w-[48px] text-right">
            {selected.size}/3 min
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-2 gap-3">
          {INTEREST_OPTIONS.map(opt => {
            const on = selected.has(opt.id);
            return (
              <motion.button key={opt.id} onClick={() => toggle(opt.id)}
                whileTap={{ scale: 0.96 }}
                className={`relative rounded-2xl overflow-hidden h-[110px] text-left transition-all duration-200
                  ${on ? "ring-2 ring-primary ring-offset-1" : "ring-0"}`}>
                <img src={img(opt.imageId, 300, 220)} alt={opt.label}
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className={`absolute inset-0 transition-colors duration-200
                  ${on ? "bg-primary/40" : "bg-black/30"}`} />
                {on && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm leading-tight">{opt.label}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-8 pt-3 flex-shrink-0 border-t border-border/40 bg-background">
        <PrimaryBtn onClick={canContinue ? onDone : undefined}
          className={!canContinue ? "opacity-50 cursor-not-allowed shadow-none" : ""}>
          <span className="flex items-center justify-center gap-2">
            Start Exploring
            <ArrowRight className="w-4 h-4" />
          </span>
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ── Main App Screens ───────────────────────────────────────────────────────
function PinCard({ post, saved, liked, onSave, onLike, onClick }: {
  post: Post; saved: boolean; liked: boolean;
  onSave: () => void; onLike: () => void; onClick: () => void;
}) {
  return (
    <div className="break-inside-avoid mb-3 cursor-pointer group" onClick={onClick}>
      <div className="relative rounded-2xl overflow-hidden bg-secondary">
        <img src={img(post.imageId, 400, 600)} alt={post.title}
          className={`w-full object-cover ${post.aspect} transition-transform duration-300 group-hover:scale-[1.03]`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <button onClick={e => { e.stopPropagation(); onSave(); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
            ${saved ? "bg-primary text-primary-foreground shadow-md" : "bg-white/90 text-primary opacity-0 group-hover:opacity-100"}`}>
          <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="px-0.5 pt-1.5 pb-1">
        <p className="text-[12.5px] font-medium text-foreground leading-tight line-clamp-2">{post.title}</p>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <Av initial={post.initial} size="sm" />
            <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">{post.author}</span>
          </div>
          <button onClick={e => { e.stopPropagation(); onLike(); }} className="flex items-center gap-0.5 p-0.5">
            <Heart className={`w-3 h-3 transition-colors ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            <span className="text-[10px] text-muted-foreground">{fmtNum(post.likes + (liked ? 1 : 0))}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MasonryGrid({ posts, savedIds, likedIds, onSave, onLike, onPostClick }: {
  posts: Post[]; savedIds: Set<string>; likedIds: Set<string>;
  onSave: (id: string) => void; onLike: (id: string) => void; onPostClick: (p: Post) => void;
}) {
  if (posts.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <Sparkles className="w-10 h-10 text-accent mb-3" />
      <p className="font-semibold text-foreground mb-1" style={serif}>Nothing here yet</p>
      <p className="text-sm text-muted-foreground">Try a different category or explore new styles</p>
    </div>
  );
  return (
    <div className="flex gap-3 px-3">
      <div className="flex-1">
        {posts.filter((_, i) => i % 2 === 0).map(p => (
          <PinCard key={p.id} post={p} saved={savedIds.has(p.id)} liked={likedIds.has(p.id)}
            onSave={() => onSave(p.id)} onLike={() => onLike(p.id)} onClick={() => onPostClick(p)} />
        ))}
      </div>
      <div className="flex-1 mt-7">
        {posts.filter((_, i) => i % 2 !== 0).map(p => (
          <PinCard key={p.id} post={p} saved={savedIds.has(p.id)} liked={likedIds.has(p.id)}
            onSave={() => onSave(p.id)} onLike={() => onLike(p.id)} onClick={() => onPostClick(p)} />
        ))}
      </div>
    </div>
  );
}

function CatPills({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: "none" }}>
      {CATEGORIES.map(c => (
        <button key={c} onClick={() => onSelect(c)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200
            ${active === c
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "bg-secondary text-secondary-foreground hover:bg-accent/20"
            }`}>{c}</button>
      ))}
    </div>
  );
}

function HomeScreen({ savedIds, likedIds, onSave, onLike, onPostClick, onNotif }: {
  savedIds: Set<string>; likedIds: Set<string>;
  onSave: (id: string) => void; onLike: (id: string) => void;
  onPostClick: (p: Post) => void; onNotif: () => void;
}) {
  const [cat, setCat] = useState("All");
  const posts = POSTS.filter(p => cat === "All" || p.category === cat);
  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div>
          <h1 className="text-[26px] font-bold leading-none text-primary" style={serif}>PinPetra</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Your style, your world</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onNotif} className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background" />
          </button>
          <Av initial="P" size="md" />
        </div>
      </div>
      <CatPills active={cat} onSelect={setCat} />
      <div className="pt-2 pb-6">
        <MasonryGrid posts={posts} savedIds={savedIds} likedIds={likedIds}
          onSave={onSave} onLike={onLike} onPostClick={onPostClick} />
      </div>
    </div>
  );
}

function SearchScreen({ savedIds, likedIds, onSave, onLike, onPostClick }: {
  savedIds: Set<string>; likedIds: Set<string>;
  onSave: (id: string) => void; onLike: (id: string) => void; onPostClick: (p: Post) => void;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const results = POSTS.filter(p => {
    const hit = q === "" || [p.title, p.category, p.author].some(s => s.toLowerCase().includes(q.toLowerCase()));
    return hit && (cat === "All" || p.category === cat);
  });
  return (
    <div>
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-xl font-bold text-foreground mb-3" style={serif}>Discover</h2>
        <div className="flex items-center gap-3 bg-secondary/60 rounded-2xl px-4 py-3 border border-accent/20">
          <Search className="w-4 h-4 text-primary flex-shrink-0" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search styles, creators, boards..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          {q && <button onClick={() => setQ("")}><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
      </div>
      {q === "" ? (
        <>
          <div className="px-4 mb-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Trending</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map(s => (
                <button key={s} onClick={() => setQ(s)}
                  className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-medium hover:bg-accent/20 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 mb-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Browse by Category</p>
          </div>
          <CatPills active={cat} onSelect={setCat} />
        </>
      ) : (
        <p className="px-4 pb-2 text-xs text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""} for "{q}"</p>
      )}
      <div className="pt-1 pb-6">
        <MasonryGrid posts={results} savedIds={savedIds} likedIds={likedIds}
          onSave={onSave} onLike={onLike} onPostClick={onPostClick} />
      </div>
    </div>
  );
}

function SavedScreen({ savedIds, likedIds, onSave, onLike, onPostClick }: {
  savedIds: Set<string>; likedIds: Set<string>;
  onSave: (id: string) => void; onLike: (id: string) => void; onPostClick: (p: Post) => void;
}) {
  const [tab, setTab] = useState<"boards" | "pins">("boards");
  const [boards, setBoards] = useState<Board[]>(INITIAL_BOARDS);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const savedPosts = POSTS.filter(p => savedIds.has(p.id));

  const create = () => {
    if (!name.trim()) return;
    setBoards(prev => [...prev, { id: `b${Date.now()}`, name: name.trim(), count: 0, coverId: savedPosts[0]?.imageId ?? POSTS[0].imageId }]);
    setName(""); setShowNew(false);
  };

  return (
    <div>
      <div className="px-5 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground" style={serif}>Saved</h2>
          <button onClick={() => setShowNew(v => !v)}
            className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-medium px-3 py-1.5 rounded-full shadow-sm shadow-primary/30">
            <Plus className="w-3 h-3" /> New Board
          </button>
        </div>
        {showNew && (
          <div className="mb-3 p-3 bg-secondary/60 rounded-xl border border-accent/20">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Board name..."
              autoFocus onKeyDown={e => e.key === "Enter" && create()}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            <div className="flex gap-2 mt-2">
              <button onClick={create} className="flex-1 bg-primary text-primary-foreground text-[11px] font-medium py-1.5 rounded-full">Create</button>
              <button onClick={() => setShowNew(false)} className="flex-1 bg-muted text-muted-foreground text-[11px] font-medium py-1.5 rounded-full">Cancel</button>
            </div>
          </div>
        )}
        <div className="flex gap-5 border-b border-border">
          {(["boards", "pins"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2.5 text-sm font-medium capitalize transition-colors ${tab === t ? "text-primary border-b-2 border-primary -mb-px" : "text-muted-foreground"}`}>
              {t} <span className="text-[11px]">({t === "boards" ? boards.length : savedPosts.length})</span>
            </button>
          ))}
        </div>
      </div>
      {tab === "boards" ? (
        <div className="grid grid-cols-2 gap-3 p-4 pb-6">
          {boards.map(b => (
            <div key={b.id} className="cursor-pointer group">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-secondary">
                <img src={img(b.coverId, 400, 400)} alt={b.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-medium text-sm leading-tight">{b.name}</p>
                  <p className="text-white/65 text-[11px]">{b.count} pins</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-3 pb-6">
          <MasonryGrid posts={savedPosts} savedIds={savedIds} likedIds={likedIds}
            onSave={onSave} onLike={onLike} onPostClick={onPostClick} />
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ savedCount, likedCount }: { savedCount: number; likedCount: number }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const stats = [
    { label: "Saved",     value: savedCount },
    { label: "Liked",     value: likedCount },
    { label: "Followers", value: 2847 },
    { label: "Following", value: 412 },
  ];
  return (
    <div className="pb-6">
      <div className="relative">
        <div className="h-28 bg-gradient-to-br from-secondary via-accent to-primary" />
        <button onClick={() => setSettingsOpen(v => !v)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </button>
        <div className="px-5">
          <div className="flex items-end gap-3 -mt-8">
            <div className="w-16 h-16 rounded-full border-4 border-background bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={serif}>P</div>
            <div className="pb-1">
              <h3 className="font-bold text-[18px] text-foreground leading-tight" style={serif}>Petra Rose</h3>
              <p className="text-xs text-muted-foreground">@petra.rose</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground/80 leading-relaxed">Fashion lover · Style curator · Living in blush tones and soft silhouettes</p>
          <div className="flex gap-5 mt-4">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-bold text-foreground text-sm">{fmtNum(s.value)}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full border border-primary text-primary text-sm font-medium py-2 rounded-full hover:bg-primary/5 transition-colors">Edit Profile</button>
        </div>
      </div>
      {settingsOpen && (
        <div className="mx-4 mt-4 bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {[
            { icon: Bell,     label: "Notifications" },
            { icon: Bookmark, label: "Saved Dashboard" },
            { icon: Download, label: "Downloads" },
            { icon: Share2,   label: "Privacy & Sharing" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-secondary/40 transition-colors border-b border-border/50 last:border-0">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground flex-1 text-left">{label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
      <div className="mt-5 px-5 mb-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Recent Pins</p>
      </div>
      <div className="grid grid-cols-3 gap-1 px-4">
        {POSTS.slice(0, 9).map(p => (
          <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-secondary">
            <img src={img(p.imageId, 200, 200)} alt={p.title} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Modals ─────────────────────────────────────────────────────────────────
function PostModal({ post, saved, liked, followed, commenting, commentText, onClose, onSave, onLike, onFollow, onDownload, onShare, onComment, onCommentChange, onCommentSubmit }: {
  post: Post; saved: boolean; liked: boolean; followed: boolean;
  commenting: boolean; commentText: string;
  onClose: () => void; onSave: () => void; onLike: () => void; onFollow: () => void;
  onDownload: () => void; onShare: () => void; onComment: () => void;
  onCommentChange: (value: string) => void; onCommentSubmit: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(45,27,36,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-background rounded-t-[28px] overflow-hidden flex flex-col" style={{ maxHeight: "92%" }}
        onClick={e => e.stopPropagation()}>
        <div className="relative flex-shrink-0">
          <img src={img(post.imageId, 800, 560)} alt={post.title} className="w-full h-[260px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button onClick={onClose} className="absolute top-3 left-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
          <button onClick={onSave}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${saved ? "bg-primary text-primary-foreground" : "bg-white text-primary"}`}>
            <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
          </button>
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-[11px] font-medium">{post.category}</span>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="px-5 pt-4 pb-8">
            <h3 className="font-bold text-[20px] text-foreground leading-tight" style={serif}>{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{post.desc}</p>
            <div className="flex items-center justify-between mt-4 py-3.5 border-y border-border/60">
              <div className="flex items-center gap-2.5">
                <Av initial={post.initial} size="md" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author}</p>
                  <p className="text-[11px] text-muted-foreground">{fmtNum(stableVal(post.id, 4500, 300))} followers</p>
                </div>
              </div>
              <button onClick={onFollow}
                className={`px-4 py-1.5 border text-xs font-medium rounded-full transition-colors ${followed ? "bg-primary text-primary-foreground border-transparent" : "border-primary text-primary hover:bg-primary/5"}`}>
                {followed ? "Following" : "Follow"}
              </button>
            </div>
            <div className="flex items-center justify-around mt-5">
              {[
                { Icon: Heart,         label: fmtNum(post.likes + (liked ? 1 : 0)), active: liked, onClick: onLike  },
                { Icon: Bookmark,      label: saved ? "Saved" : "Save",             active: saved, onClick: onSave  },
                { Icon: Download,      label: "Download",                            active: false, onClick: onDownload  },
                { Icon: Share2,        label: "Share",                               active: false, onClick: onShare  },
                { Icon: MessageCircle, label: "Comment",                             active: commenting, onClick: onComment  },
              ].map(({ Icon, label, active, onClick }) => (
                <button key={label} onClick={onClick}
                  className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-xl hover:bg-secondary/60 transition-colors">
                  <Icon className="w-5 h-5 transition-colors" style={{ color: active ? "#C2185B" : "#9B6B7D" }} fill={active ? "#C2185B" : "none"} />
                  <span className="text-[10px] text-muted-foreground font-medium leading-none">{label}</span>
                </button>
              ))}
            </div>
            {commenting && (
              <div className="mt-4 rounded-3xl border border-border/60 bg-secondary/60 p-4">
                <p className="text-xs text-muted-foreground mb-2">Add a note to this pin</p>
                <div className="flex gap-2">
                  <input value={commentText} onChange={e => onCommentChange(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  <button onClick={onCommentSubmit}
                    className="rounded-2xl bg-primary px-4 py-2 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NotifModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(45,27,36,0.45)", backdropFilter: "blur(3px)" }}
      onClick={onClose}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-background rounded-t-[28px] overflow-hidden flex flex-col" style={{ maxHeight: "70%" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/60">
          <h3 className="font-bold text-lg text-foreground" style={serif}>Notifications</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1" style={{ scrollbarWidth: "none" }}>
          {NOTIFS.map((n, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
              <Av initial={n.initial} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  <span className="font-semibold">{n.user}</span> {n.action}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{n.time} ago</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function BottomNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  const items: { id: View; Icon: typeof Home; label: string }[] = [
    { id: "home",    Icon: Home,     label: "Home"    },
    { id: "search",  Icon: Search,   label: "Search"  },
    { id: "saved",   Icon: Bookmark, label: "Saved"   },
    { id: "profile", Icon: User,     label: "Profile" },
  ];
  return (
    <div className="flex items-center bg-background/95 border-t border-border/50 px-2 pt-2 pb-3"
      style={{ backdropFilter: "blur(10px)" }}>
      {items.map(({ id, Icon, label }) => {
        const active = view === id;
        return (
          <button key={id} onClick={() => setView(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl transition-colors
              ${active ? "text-primary" : "text-muted-foreground hover:text-foreground/70"}`}>
            <Icon className={`w-5 h-5 transition-all duration-200 ${active ? "scale-110" : ""}`}
              fill={active ? "rgba(194,24,91,0.12)" : "none"} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
            {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [stage, setStage]           = useState<AppStage>("splash");
  const [view, setView]             = useState<View>("home");
  const [savedIds, setSavedIds]     = useState<Set<string>>(new Set(["2", "6", "9", "11"]));
  const [likedIds, setLikedIds]     = useState<Set<string>>(new Set(["1", "4", "8"]));
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showNotif, setShowNotif]   = useState(false);

  const toggleSave = (id: string) => setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleLike = (id: string) => setLikedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFollow = (id: string) => setFollowedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const downloadImage = (post: Post) => {
    const url = img(post.imageId, 1600, 1200);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${post.title.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}.jpg`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    showToast("Download started");
  };

  const sharePost = async (post: Post) => {
    const shareData = {
      title: post.title,
      text: `Check out this PinPetra inspiration: ${post.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast("Shared successfully");
      } else {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
        showToast("Link copied to clipboard");
      }
    } catch (error) {
      showToast("Share action canceled");
    }
  };

  const openComment = (id: string) => {
    setCommentingPostId(id);
    setCommentText("");
  };

  const submitComment = () => {
    if (!commentText.trim()) {
      showToast("Write a comment before posting");
      return;
    }
    showToast("Comment posted");
    setCommentText("");
    setCommentingPostId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(145deg, #F8D7E5 0%, #FDEEF5 45%, #EDD5E4 100%)",
      }}>
      <div className="relative w-full max-w-[390px] bg-background flex flex-col overflow-hidden"
        style={{
          height: "844px",
          borderRadius: "44px",
          boxShadow: "0 50px 100px rgba(194,24,91,0.22), 0 0 0 1px rgba(194,24,91,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}>

        {/* Status bar — shown outside pre-auth stages */}
        {stage === "main" && (
          <div className="flex items-center justify-between px-7 py-2.5 flex-shrink-0 bg-background">
            <span className="text-[13px] font-semibold text-foreground">9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px]">
                {[5, 7, 9, 11].map(h => (
                  <div key={h} className="w-[3px] bg-foreground/60 rounded-sm" style={{ height: `${h}px` }} />
                ))}
              </div>
              <svg viewBox="0 0 16 12" className="w-4 h-3 fill-foreground/60">
                <rect x="0.75" y="0.75" width="13.5" height="10.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="14.5" y="3.5" width="1.5" height="5" rx="0.75" />
                <rect x="2" y="2" width="9" height="8" rx="0.5" />
              </svg>
            </div>
          </div>
        )}

        {/* Pre-auth overlays */}
        <AnimatePresence mode="wait">
          {stage === "splash" && (
            <motion.div key="splash" className="absolute inset-0 z-40"
              exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <SplashScreen onDone={() => setStage("onboarding")} />
            </motion.div>
          )}
          {stage === "onboarding" && (
            <motion.div key="onboarding" className="absolute inset-0 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <OnboardingScreen onDone={() => setStage("auth")} />
            </motion.div>
          )}
          {stage === "auth" && (
            <motion.div key="auth" className="absolute inset-0 z-40"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "-30%", opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
              <AuthScreen onDone={() => setStage("interests")} />
            </motion.div>
          )}
          {stage === "interests" && (
            <motion.div key="interests" className="absolute inset-0 z-40"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "-30%", opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
              <InterestsScreen onDone={() => setStage("main")} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main app (always mounted, visible once stage === "main") */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ${stage === "main" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {view === "home"    && <HomeScreen savedIds={savedIds} likedIds={likedIds} onSave={toggleSave} onLike={toggleLike} onPostClick={setActivePost} onNotif={() => setShowNotif(true)} />}
            {view === "search"  && <SearchScreen savedIds={savedIds} likedIds={likedIds} onSave={toggleSave} onLike={toggleLike} onPostClick={setActivePost} />}
            {view === "saved"   && <SavedScreen savedIds={savedIds} likedIds={likedIds} onSave={toggleSave} onLike={toggleLike} onPostClick={setActivePost} />}
            {view === "profile" && <ProfileScreen savedCount={savedIds.size} likedCount={likedIds.size} />}
          </div>
          <BottomNav view={view} setView={setView} />
        </div>

        {/* Modals */}
        {stage === "main" && activePost && (
          <PostModal post={activePost} saved={savedIds.has(activePost.id)} liked={likedIds.has(activePost.id)}
            followed={followedIds.has(activePost.id)} commenting={commentingPostId === activePost.id} commentText={commentText}
            onClose={() => setActivePost(null)} onSave={() => toggleSave(activePost.id)} onLike={() => toggleLike(activePost.id)}
            onFollow={() => toggleFollow(activePost.id)} onDownload={() => downloadImage(activePost)} onShare={() => sharePost(activePost)}
            onComment={() => openComment(activePost.id)} onCommentChange={setCommentText} onCommentSubmit={submitComment} />
        )}
        {stage === "main" && showNotif && <NotifModal onClose={() => setShowNotif(false)} />}
      </div>
    </div>
  );
}
