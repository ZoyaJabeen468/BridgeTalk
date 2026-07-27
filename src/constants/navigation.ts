export const navLinks = [
  { href: "/#who", label: "Communication" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About" },
] as const;

export const footerLinks = {
  product: [
    { href: "/generate", label: "Prepare a conversation" },
    { href: "/skills", label: "Daily skills practice" },
    { href: "/generate?sample=1", label: "Try a sample pack" },
    { href: "/#how-it-works", label: "How it works" },
  ],
  guidance: [
    { href: "/about", label: "About BridgeTalk" },
    { href: "/about#why", label: "Why it exists" },
    { href: "/skills", label: "Build calmer habits" },
    { href: "/about#principles", label: "Our principles" },
  ],
} as const;
