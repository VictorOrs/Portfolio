"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import SquircleCard from "@/components/ui/SquircleCard";
import ChangingSpan from "@/components/ui/ChangingSpan";
import LinkedInIcon from "@/components/ui/LinkedInIcon";
import DribbbleIcon from "@/components/ui/DribbbleIcon";
import MailIcon from "@/components/ui/MailIcon";
import Logo from "@/components/ui/Logo";
import PlayIcon from "@/components/ui/PlayIcon";
import PauseIcon from "@/components/ui/PauseIcon";
import PlusIcon from "@/components/ui/PlusIcon";
import MinusIcon from "@/components/ui/MinusIcon";
import PlayPauseButton from "@/components/ui/PlayPauseButton";
import WorkCard from "@/components/ui/WorkCard";
import WorkController from "@/components/ui/WorkController";

// ── Helpers ───────────────────────────────────────────────────────────────────

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
        {title}
      </h3>
      {children}
    </div>
  );
}

function TypoRow({ token, size, lh, w, font, tracking, children }: {
  token: string; size: string; lh: string; w: string; font: string; tracking?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-12">
      <div className="w-48 shrink-0 flex flex-col gap-1">
        <code className="font-mono text-[12px] text-text-accent">text-{token}</code>
        <div className="flex flex-col gap-0.5">
          <Spec label="size"   value={size} />
          <Spec label="lh"     value={lh} />
          <Spec label="weight" value={w} />
          <Spec label="font"   value={font} />
          {tracking && <Spec label="tracking" value={tracking} />}
        </div>
      </div>
      {children}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 items-baseline">
      <span className="font-body text-[12px] text-text-secondary shrink-0">{label}</span>
      <code className="font-mono text-[12px] text-text-accent bg-alpha px-1.5 py-0.5 rounded">{value}</code>
    </div>
  );
}

function ColorSwatch({ token, cssVar, hex, dark }: { token: string; cssVar: string; hex: string; dark?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-14 rounded-xl border border-alpha" style={{ background: `var(${cssVar})` }} />
      <div className="flex flex-col gap-1">
        <span className="font-body font-medium text-[13px] text-text-primary">{token}</span>
        <code className="font-mono text-[11px] text-text-secondary">{cssVar}</code>
        <div className="flex gap-2 flex-wrap">
          <code className="font-mono text-[11px] text-text-secondary">☀ {hex}</code>
          {dark && <code className="font-mono text-[11px] text-text-secondary">● {dark}</code>}
        </div>
      </div>
    </div>
  );
}

// ── Tab content ───────────────────────────────────────────────────────────────

function TabColors() {
  return (
    <div className="flex flex-col gap-12">
      <Subsection title="Backgrounds">
        <div className="grid grid-cols-4 gap-6">
          <ColorSwatch token="background.base"    cssVar="--color-bg-base"    hex="#F5F5F5" dark="#090909" />
          <ColorSwatch token="background.surface" cssVar="--color-bg-surface" hex="#E0E0E0" dark="#1C1C1C" />
        </div>
      </Subsection>
      <Subsection title="Text">
        <div className="grid grid-cols-4 gap-6">
          <ColorSwatch token="text.primary"   cssVar="--color-text-primary"   hex="#383C48" dark="#F5F5F5" />
          <ColorSwatch token="text.secondary" cssVar="--color-text-secondary" hex="#ABACB2" dark="#B8B8B8" />
          <ColorSwatch token="text.accent"    cssVar="--color-text-accent"    hex="#725FEB" />
        </div>
      </Subsection>
      <Subsection title="Overlays">
        <div className="grid grid-cols-4 gap-6">
          <ColorSwatch token="alpha"        cssVar="--color-alpha"        hex="#09090914" dark="#FFFFFF1A" />
          <ColorSwatch token="alpha-revert" cssVar="--color-alpha-revert" hex="#FFFFFF14" dark="#0909090F" />
        </div>
      </Subsection>
      <Subsection title="Status & Brand">
        <div className="grid grid-cols-4 gap-6">
          <ColorSwatch token="success"             cssVar="--color-success"             hex="#0EBE6A" />
          <ColorSwatch token="error"               cssVar="--color-error"               hex="#DF2626" />
          <ColorSwatch token="brand"               cssVar="--color-brand"               hex="#4779FF" />
          <ColorSwatch token="accent.purple"       cssVar="--color-accent-purple"       hex="#725FEB" />
          <ColorSwatch token="accent.purple.dark"  cssVar="--color-accent-purple-dark"  hex="#5A3A88" />
          <ColorSwatch token="accent.purple.light" cssVar="--color-accent-purple-light" hex="#F4EBFF" />
        </div>
      </Subsection>
      <Subsection title="Button / Primary">
        <div className="grid grid-cols-4 gap-6">
          <ColorSwatch token="btn.primary.bg"    cssVar="--color-btn-primary-bg"       hex="#090909" dark="#E0E0E0" />
          <ColorSwatch token="btn.primary.hover" cssVar="--color-btn-primary-bg-hover" hex="#202020" dark="#FFFFFF" />
          <ColorSwatch token="btn.primary.text"  cssVar="--color-btn-primary-text"     hex="#F5F5F5" dark="#090909" />
        </div>
      </Subsection>
    </div>
  );
}

function TabTypography() {
  return (
    <div className="flex flex-col gap-10">
      <TypoRow token="display-1" size="88px" lh="104px" w="500" font="Nohemi">
        <p className="font-display text-display-1 text-text-primary">Speed up</p>
      </TypoRow>
      <TypoRow token="heading-2" size="64px" lh="72px" w="500" font="Nohemi">
        <p className="font-display text-heading-2 text-text-primary">Section title</p>
      </TypoRow>
      <TypoRow token="heading-3" size="48px" lh="56px" w="500" font="Nohemi">
        <p className="font-display text-heading-3 text-text-primary">Section title</p>
      </TypoRow>
      <TypoRow token="heading-4" size="32px" lh="40px" w="500" font="Nohemi">
        <p className="font-display text-heading-4 text-text-primary">Card heading</p>
      </TypoRow>
      <TypoRow token="body" size="20px" lh="32px" w="400" font="Inter">
        <p className="font-body text-body text-text-primary">Body copy goes here.</p>
      </TypoRow>
      <TypoRow token="body-m" size="16px" lh="24px" w="400" font="Inter">
        <p className="font-body text-body-m text-text-primary">Body medium — Worked on</p>
      </TypoRow>
      <TypoRow token="btn-lg" size="18px" lh="20px" w="600" font="Nohemi">
        <p className="font-display text-btn-lg text-text-primary">Book a call</p>
      </TypoRow>
      <TypoRow token="btn-md" size="16px" lh="20px" w="600" font="Nohemi">
        <p className="font-display text-btn-md text-text-primary">Learn more</p>
      </TypoRow>
      <TypoRow token="link" size="16px" lh="20px" w="500" font="Inter">
        <p className="font-body text-link text-text-primary">See all projects</p>
      </TypoRow>
      <TypoRow token="label" size="14px" lh="20px" w="600" font="Inter" tracking="8px">
        <p className="font-body text-label text-text-primary uppercase">01. Discovery</p>
      </TypoRow>
    </div>
  );
}

function TabSpacing() {
  return (
    <div className="flex flex-col gap-4">
      {[
        { token: "xs",  px: "40px" },
        { token: "s",   px: "64px" },
        { token: "m",   px: "80px" },
        { token: "l",   px: "120px" },
        { token: "xl",  px: "177px" },
        { token: "xxl", px: "289px" },
      ].map(({ token, px }) => (
        <div key={token} className="flex items-center gap-4">
          <code className="font-mono text-[12px] text-text-accent w-10 shrink-0">{token}</code>
          <div className="h-6 bg-accent-purple rounded" style={{ width: px }} />
          <span className="font-mono text-[12px] text-text-secondary">{px}</span>
        </div>
      ))}
    </div>
  );
}

function TabEffects() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="flex flex-col gap-3">
        <Subsection title="Backdrop blur — glass">
          <div className="relative h-20 rounded-xl overflow-hidden">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #725FEB, #4779FF)" }} />
            <div className="absolute inset-2 rounded-lg backdrop-blur-glass bg-alpha border border-alpha" />
          </div>
          <Spec label="value" value="24px" />
          <Spec label="token" value="backdrop-blur-glass" />
        </Subsection>
      </div>
      <div className="flex flex-col gap-3">
        <Subsection title="Shadow — btn-glow">
          <div className="h-20 flex items-center justify-center">
            <div className="w-20 h-8 rounded-full bg-btn-primary-bg shadow-btn-glow" />
          </div>
          <Spec label="value" value="0px 0px 20px rgba(255,255,255,0.48)" />
          <Spec label="token" value="shadow-btn-glow" />
        </Subsection>
      </div>
    </div>
  );
}

function TabButton() {
  return (
    <div className="flex flex-col gap-10">
      <Subsection title="Variants × Sizes">
        <div className="flex flex-wrap gap-6 items-center p-8 bg-background-surface rounded-2xl">
          <Button variant="primary"   size="lg">Book a call</Button>
          <Button variant="primary"   size="md">Book a call</Button>
          <Button variant="secondary" size="lg">Learn more</Button>
          <Button variant="secondary" size="md">Learn more</Button>
          <Button variant="secondary" size="lg" icon={<MailIcon />} aria-label="Mail" />
          <Button variant="primary"   size="lg" icon={<MailIcon />}>Send email</Button>
        </div>
      </Subsection>
      <Subsection title="Props">
        <div className="grid grid-cols-3 gap-4 font-mono text-[13px]">
          <div className="bg-background-surface rounded-xl p-4 flex flex-col gap-2">
            <span className="text-text-accent">variant</span>
            <span className="text-text-secondary">&quot;primary&quot; | &quot;secondary&quot;</span>
            <span className="text-text-secondary text-[11px]">default: &quot;primary&quot;</span>
          </div>
          <div className="bg-background-surface rounded-xl p-4 flex flex-col gap-2">
            <span className="text-text-accent">size</span>
            <span className="text-text-secondary">&quot;lg&quot; | &quot;md&quot;</span>
            <span className="text-text-secondary text-[11px]">default: &quot;lg&quot;</span>
          </div>
          <div className="bg-background-surface rounded-xl p-4 flex flex-col gap-2">
            <span className="text-text-accent">icon</span>
            <span className="text-text-secondary">ReactNode</span>
            <span className="text-text-secondary text-[11px]">renders outside label span</span>
          </div>
        </div>
      </Subsection>
      <Subsection title="Notes">
        <ul className="font-body text-body text-text-secondary flex flex-col gap-1 list-disc list-inside">
          <li>Shimmer + glow owned by <code className="text-text-accent font-mono text-[14px]">.btn-primary</code> in globals.css</li>
          <li>Add <code className="text-text-accent font-mono text-[14px]">.light-card</code> to parent to suppress shimmer on light bg</li>
          <li><code className="text-text-accent font-mono text-[14px]">buttonVariants</code> exported for use on <code className="text-text-accent font-mono text-[14px]">&lt;a&gt;</code> / <code className="text-text-accent font-mono text-[14px]">&lt;Link&gt;</code></li>
        </ul>
      </Subsection>
    </div>
  );
}

function TabSquircleCard() {
  return (
    <div className="flex flex-col gap-10">
      <Subsection title="Variants">
        <div className="flex gap-8 items-start flex-wrap">
          {[
            { radius: 20, label: "radius=20" },
            { radius: 40, label: "radius=40 (default)" },
          ].map(({ radius, label }) => (
            <div key={radius} className="flex flex-col gap-3 items-center">
              <SquircleCard radius={radius} className="bg-background-surface flex items-center justify-center" style={{ width: 160, height: 100 }}>
                <span className="font-mono text-[12px] text-text-secondary">{radius}px</span>
              </SquircleCard>
              <span className="font-mono text-[12px] text-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </Subsection>
      <Subsection title="Props">
        <div className="grid grid-cols-3 gap-4 font-mono text-[13px]">
          <div className="bg-background-surface rounded-xl p-4 flex flex-col gap-2">
            <span className="text-text-accent">radius</span>
            <span className="text-text-secondary">number</span>
            <span className="text-text-secondary text-[11px]">default: 40</span>
          </div>
          <div className="bg-background-surface rounded-xl p-4 flex flex-col gap-2">
            <span className="text-text-accent">smoothing</span>
            <span className="text-text-secondary">number</span>
            <span className="text-text-secondary text-[11px]">default: 0.6 (Figma)</span>
          </div>
        </div>
      </Subsection>
      <Subsection title="Notes">
        <ul className="font-body text-body text-text-secondary flex flex-col gap-1 list-disc list-inside">
          <li>Drop-in <code className="text-text-accent font-mono text-[14px]">&lt;div&gt;</code> — accepts all HTML div props</li>
          <li>SSR-safe: fallback <code className="text-text-accent font-mono text-[14px]">border-radius</code>, then <code className="text-text-accent font-mono text-[14px]">clip-path</code> after hydration</li>
          <li>Uses <code className="text-text-accent font-mono text-[14px]">ResizeObserver</code> to stay accurate on resize</li>
        </ul>
      </Subsection>
    </div>
  );
}

function TabChangingSpan() {
  return (
    <div className="flex flex-col gap-10">
      <Subsection title="Preview">
        <div className="p-8 bg-background-surface rounded-2xl">
          <ChangingSpan />
        </div>
      </Subsection>
      <Subsection title="Notes">
        <ul className="font-body text-body text-text-secondary flex flex-col gap-1 list-disc list-inside">
          <li>Cycling pill via framer-motion <code className="text-text-accent font-mono text-[14px]">layout</code> + <code className="text-text-accent font-mono text-[14px]">AnimatePresence mode=&quot;popLayout&quot;</code></li>
          <li>Height fixed at <code className="text-text-accent font-mono text-[14px]">104px</code> via inline style — prevents framer-motion interpolation</li>
          <li><code className="text-text-accent font-mono text-[14px]">borderRadius</code> also inline for the same reason</li>
        </ul>
      </Subsection>
    </div>
  );
}

function TabIcons() {
  return (
    <Subsection title="Preview">
      <div className="flex gap-10 items-center p-8 bg-background-surface rounded-2xl flex-wrap">
        {[
          { label: "LinkedInIcon", node: <LinkedInIcon /> },
          { label: "DribbbleIcon", node: <DribbbleIcon /> },
          { label: "MailIcon",     node: <MailIcon /> },
          { label: "Logo",         node: <Logo /> },
          { label: "PlayIcon",     node: <PlayIcon /> },
          { label: "PauseIcon",    node: <PauseIcon /> },
          { label: "PlusIcon",     node: <PlusIcon /> },
          { label: "MinusIcon",    node: <MinusIcon /> },
        ].map(({ label, node }) => (
          <div key={label} className="flex flex-col gap-2 items-center">
            {node}
            <span className="font-mono text-[11px] text-text-secondary">{label}</span>
          </div>
        ))}
      </div>
    </Subsection>
  );
}

function TabPlayPauseButton() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="flex flex-col gap-10">
      <Subsection title="Preview">
        <div className="p-8 bg-background-surface rounded-2xl flex gap-6 items-center">
          <PlayPauseButton paused={paused} onClick={() => setPaused((p) => !p)} />
          <span className="font-mono text-[13px] text-text-secondary">paused: {String(paused)}</span>
        </div>
      </Subsection>
      <Subsection title="Notes">
        <ul className="font-body text-body text-text-secondary flex flex-col gap-1 list-disc list-inside">
          <li>SVG path morphing via <code className="text-text-accent font-mono text-[14px]">useMotionValue</code> + standalone <code className="text-text-accent font-mono text-[14px]">animate()</code></li>
          <li>Both paths share M L L L Z command structure for smooth interpolation</li>
          <li>Wraps <code className="text-text-accent font-mono text-[14px]">Button variant=&quot;secondary&quot; size=&quot;md&quot;</code></li>
        </ul>
      </Subsection>
    </div>
  );
}

function TabWorkController() {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-10">
      <Subsection title="Preview">
        <div className="p-8 bg-background-base rounded-2xl flex justify-center">
          <WorkController
            count={3}
            activeIndex={active}
            progress={0.4}
            paused={paused}
            onTogglePause={() => setPaused((p) => !p)}
            onDotClick={setActive}
          />
        </div>
      </Subsection>
      <Subsection title="Notes">
        <ul className="font-body text-body text-text-secondary flex flex-col gap-1 list-disc list-inside">
          <li>Active dot morphs to progress bar via <code className="text-text-accent font-mono text-[14px]">motion.button animate=&#123;&#123; width &#125;&#125;</code></li>
          <li>Dark mode tokens: <code className="text-text-accent font-mono text-[14px]">bg-alpha-revert</code>, <code className="text-text-accent font-mono text-[14px]">outline-alpha</code></li>
        </ul>
      </Subsection>
    </div>
  );
}

function TabWorkCard() {
  return (
    <div className="flex flex-col gap-10">
      <Subsection title="Full card (Enuma)">
        <WorkCard
          logo={{ src: "/img/work/enuma_logo.svg", alt: "enuma" }}
          title={"Lasting partnership as\nProduct & Brand Designer"}
          showWorkedOn
          ctaPrimary={{ label: "Learn more", href: "#" }}
          ctaSecondary={{ label: "Visit enuma-collective.com", href: "https://www.enuma-collective.com" }}
        />
      </Subsection>
      <Subsection title="Empty card">
        <WorkCard />
      </Subsection>
      <Subsection title="Props">
        <div className="grid grid-cols-3 gap-4 font-mono text-[13px]">
          {[
            { prop: "height",       type: "number",    note: "default: 540" },
            { prop: "logo",         type: "{ src, alt }", note: "above title" },
            { prop: "title",        type: "string",    note: "whitespace-pre-line" },
            { prop: "showWorkedOn", type: "boolean",   note: "scrolling marquee" },
            { prop: "ctaPrimary",   type: "{ label, href }", note: "primary button" },
            { prop: "ctaSecondary", type: "{ label, href }", note: "secondary button" },
            { prop: "illustration", type: "ReactNode", note: "absolute bg layer" },
          ].map(({ prop, type, note }) => (
            <div key={prop} className="bg-background-surface rounded-xl p-4 flex flex-col gap-2">
              <span className="text-text-accent">{prop}</span>
              <span className="text-text-secondary">{type}</span>
              <span className="text-text-secondary text-[11px]">{note}</span>
            </div>
          ))}
        </div>
      </Subsection>
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "colors",       label: "Colors",       content: <TabColors /> },
  { id: "typography",   label: "Typography",   content: <TabTypography /> },
  { id: "spacing",      label: "Spacing",      content: <TabSpacing /> },
  { id: "effects",      label: "Effects",      content: <TabEffects /> },
  { id: "button",       label: "Button",       content: <TabButton /> },
  { id: "squircle",     label: "SquircleCard", content: <TabSquircleCard /> },
  { id: "changingspan", label: "ChangingSpan", content: <TabChangingSpan /> },
  { id: "icons",        label: "Icons & Logo",     content: <TabIcons /> },
  { id: "playpause",    label: "PlayPauseButton",  content: <TabPlayPauseButton /> },
  { id: "controller",  label: "WorkController",   content: <TabWorkController /> },
  { id: "workcard",    label: "WorkCard",          content: <TabWorkCard /> },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  const [active, setActive] = useState("colors");
  const current = TABS.find((t) => t.id === active)!;

  return (
    <main className="min-h-screen bg-background-base pt-[80px]">
      <div className="max-w-[1440px] mx-auto px-xl py-l flex gap-16">

        {/* ── Left nav ──────────────────────────────────────────────────────── */}
        <aside className="w-52 shrink-0 flex flex-col gap-1 sticky top-[112px] self-start">
          <p className="font-body text-[11px] tracking-[1.5px] uppercase text-text-secondary font-semibold mb-3 px-3">
            Design System
          </p>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={[
                "text-left px-3 py-2 rounded-lg font-body text-[14px] transition-colors",
                active === tab.id
                  ? "bg-alpha text-text-primary font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-alpha",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-10 pb-20">
          <div className="flex flex-col gap-2 border-b border-alpha pb-6">
            <h1 className="font-display text-heading-3 text-text-primary">{current.label}</h1>
          </div>
          {current.content}
        </div>

      </div>
    </main>
  );
}
