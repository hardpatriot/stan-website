"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppStoreButton } from "./AppStoreButton";
import { PhoneFrame } from "./PhoneFrame";

/*
 * Tout ce fichier est dessiné en POINTS iOS, dans un écran de 393×852 que
 * PhoneFrame met à l'échelle. Les valeurs viennent donc directement de
 * PollView.swift, ProfileCard.swift et PollsPageView.swift.
 */

/* --------------------------------------------------------------- données */

const QUESTIONS = [
  { emoji: "grinning_face_with_smiling_eyes", text: "Qui a le plus beau sourire ?" },
  { emoji: "face_with_tears_of_joy", text: "Qui te fait le plus rire ?" },
  { emoji: "heart_hands", text: "Sur qui on peut toujours compter ?" },
  { emoji: "fire", text: "Qui a le plus de style ?" },
  { emoji: "sparkles", text: "Qui mérite plus d'attention ?" },
  { emoji: "brain", text: "Qui a toujours la meilleure idée ?" },
];

const DEFAULT_FRIENDS = ["Lana Chung", "Lucas Chevalier", "Léa Sacla", "Noha Kanté"];

/** Les dégradés de carte de l'app — PollCardExperience.gradients. */
const CARD_GRADIENTS = [
  ["#F7A25B", "#F78C60", "#F67566", "#F65E6D", "#F64773", "#F53079", "#F5187F", "#F50384"],
  ["#6001FF", "#5601FF", "#4B01FF", "#4001FF", "#3501FF", "#2A01FF", "#1F01FF", "#1501FF"],
  ["#45F9FD", "#49DCFD", "#4CBDFC", "#4F9FFC", "#5380FC", "#5662FB", "#5A43FB", "#5D26FB"],
  ["#B35BE6", "#B153E7", "#AF4CE7", "#AD44E8", "#AB3CE9", "#A935E9", "#A72DEA", "#A526EB"],
];

const TOTAL_ROUNDS = 3;

/* ----------------------------------------------------------- utilitaires */

function gradientCss(stops: string[]) {
  const parts = stops.map(
    (hex, i) => `${hex} ${((i / (stops.length - 1)) * 100).toFixed(1)}%`,
  );
  return `linear-gradient(180deg, ${parts.join(", ")})`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function shuffled<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Prénom sur une ligne, nom sur la suivante — comme ProfileCard. */
function splitName(name: string) {
  const [first, ...rest] = name.split(/\s+/).filter(Boolean);
  return { first: first ?? name, last: rest.join(" ") };
}

/* ------------------------------------------------------------------- vue */

type Stage = "vote" | "reveal";

export function VoteDemo() {
  const [friends, setFriends] = useState<string[]>(DEFAULT_FRIENDS);
  // Trio et dégradé figés au premier rendu : le HTML du serveur et celui du
  // client doivent être identiques. Le tirage au sort n'arrive qu'au rejeu.
  const [deck, setDeck] = useState(() => QUESTIONS.slice(0, TOTAL_ROUNDS));
  const [gradient, setGradient] = useState(0);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [stage, setStage] = useState<Stage>("vote");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [notifIn, setNotifIn] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const question = deck[round] ?? deck[0];

  function finish() {
    setStage("reveal");
    later(() => setNotifIn(true), 550);
  }

  function vote(index: number) {
    if (picked !== null || stage !== "vote") return;
    setPicked(index);
    later(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        finish();
      } else {
        setRound((r) => r + 1);
        setPicked(null);
      }
    }, 720);
  }

  function replay() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDeck(shuffled(QUESTIONS).slice(0, TOTAL_ROUNDS));
    setGradient(Math.floor(Math.random() * CARD_GRADIENTS.length));
    setRound(0);
    setPicked(null);
    setNotifIn(false);
    setStage("vote");
  }

  function skip() {
    if (stage !== "vote" || picked !== null) return;
    if (round + 1 >= TOTAL_ROUNDS) finish();
    else setRound((r) => r + 1);
  }

  function shuffleNames() {
    if (picked !== null) return;
    setFriends((f) => shuffled(f));
  }

  function addFriend(e: React.FormEvent) {
    e.preventDefault();
    const name = draft.trim();
    if (!name) return;
    setFriends((f) => [name, ...f.slice(0, 3)]);
    setDraft("");
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <PhoneFrame>
        {stage === "vote" ? (
          <VoteScreen
            question={question}
            gradient={CARD_GRADIENTS[gradient]}
            friends={friends}
            picked={picked}
            round={round}
            editing={editing}
            draft={draft}
            onDraft={setDraft}
            onAdd={addFriend}
            onToggleEdit={() => setEditing((v) => !v)}
            onVote={vote}
            onSkip={skip}
            onShuffle={shuffleNames}
          />
        ) : (
          <RevealScreen notifIn={notifIn} onReplay={replay} />
        )}
      </PhoneFrame>

      <p className="text-center text-[13px] font-medium text-white/35">
        {stage === "vote" ? "Vas-y, vote." : "Voilà ce que ton pote reçoit."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ écran vote */

function VoteScreen({
  question,
  gradient,
  friends,
  picked,
  round,
  editing,
  draft,
  onDraft,
  onAdd,
  onToggleEdit,
  onVote,
  onSkip,
  onShuffle,
}: {
  question: (typeof QUESTIONS)[number];
  gradient: string[];
  friends: string[];
  picked: number | null;
  round: number;
  editing: boolean;
  draft: string;
  onDraft: (v: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onToggleEdit: () => void;
  onVote: (i: number) => void;
  onSkip: () => void;
  onShuffle: () => void;
}) {
  return (
    // La carte de sondage : rayon 47, ombre de fullScreenCard.
    <div
      className="absolute inset-x-0 top-[52px] bottom-[26px] flex flex-col items-center rounded-[47px]"
      style={{
        background: gradientCss(gradient),
        boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
      }}
    >
      {/* En-tête : « X sur Y » + PageControlView */}
      <div className="flex flex-col items-center gap-2 pt-[22px]">
        <p className="text-[18px] leading-none font-semibold text-white">
          {round + 1} sur {TOTAL_ROUNDS}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <span
              key={i}
              className="h-[3.2px] w-[23.5px] rounded-[12px] transition-colors duration-500"
              style={{ background: i <= round ? "#fff" : "#8E8E93" }}
            />
          ))}
        </div>
      </div>

      {/* L'emoji 3D posé sans fond, comme QuestionEmojiIconView */}
      <div key={question.emoji} className="animate-rise mt-[26px] flex flex-col items-center">
        <Image
          src={`/emoji/${question.emoji}.svg`}
          alt=""
          width={86}
          height={86}
          className="h-[86px] w-[86px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]"
          priority
        />
        <h3 className="mt-[18px] max-w-[320px] text-center text-[18px] leading-[1.25] font-semibold text-white text-balance">
          {question.text}
        </h3>
      </div>

      {/* Ajouter ses potes — le seul ajout par rapport à l'app */}
      <div className="mt-[18px] w-[304px] shrink-0">
        {editing ? (
          <form onSubmit={onAdd} className="flex gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => onDraft(e.target.value)}
              maxLength={22}
              placeholder="Prénom d'un pote"
              className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-[15px] font-semibold text-night-900 outline-none placeholder:text-black/35"
            />
            <button
              type="submit"
              aria-label="Ajouter ce pote"
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-black/20 text-[20px] leading-none font-semibold text-white transition active:scale-90"
            >
              +
            </button>
          </form>
        ) : (
          <button
            onClick={onToggleEdit}
            className="mx-auto block rounded-full bg-black/15 px-4 py-1.5 text-[13px] font-semibold text-white/90 transition hover:bg-black/25"
          >
            ✏️ Mets les prénoms de tes potes
          </button>
        )}
      </div>

      {/* Spacer de PollView, avant la grille */}
      <div className="flex-1" />

      {/* La grille 2×2 : tuiles 147×147, espacement 10 */}
      <div className="grid shrink-0 grid-cols-2 gap-[10px]">
        {friends.slice(0, 4).map((name, i) => (
          <ChoiceTile
            key={`${name}-${i}`}
            name={name}
            picked={picked === i}
            dimmed={picked !== null && picked !== i}
            disabled={picked !== null}
            onClick={() => onVote(i)}
          />
        ))}
      </div>

      <div className="flex-1" />

      {/* Shuffle / Skip — les boutons de l'app, espacement 30 */}
      <div className="flex shrink-0 items-center gap-[30px]">
        <button
          onClick={onShuffle}
          disabled={picked !== null}
          aria-label="Mélanger les potes"
          className="transition active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          <Image src="/shuffle.png" alt="Shuffle" width={121} height={60} className="h-[60px] w-auto" />
        </button>
        <button
          onClick={onSkip}
          disabled={picked !== null}
          aria-label="Passer la question"
          className="transition active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          <Image src="/skip.png" alt="Skip" width={121} height={60} className="h-[60px] w-auto" />
        </button>
      </div>

      <div className="flex-1" />
    </div>
  );
}

/* ----------------------------------------------------- carte d'un choix */

/**
 * Le verre blanc-lilas de PollChoiceLightGlassCard : nacre, halo radial,
 * double liseré, et l'ombre violette qui décolle la carte du dégradé.
 */
function ChoiceTile({
  name,
  picked,
  dimmed,
  disabled,
  onClick,
}: {
  name: string;
  picked: boolean;
  dimmed: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const { first, last } = splitName(name);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-[147px] w-[147px] flex-col items-center justify-center overflow-hidden rounded-[16px] transition-all duration-500 active:scale-95 ${
        picked ? "scale-[1.03]" : ""
      } ${dimmed ? "scale-95 opacity-40" : ""}`}
      style={{
        background:
          "radial-gradient(circle at 42% 28%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.34) 52%, rgba(255,255,255,0) 76%), linear-gradient(160deg, #ffffff 0%, #fefcff 46%, #f9f2fd 100%)",
        boxShadow:
          "0 8px 11px rgba(91,33,182,0.42), 0 4px 5px rgba(0,0,0,0.15), inset 0 0 0 1.55px rgba(255,255,255,0.92)",
      }}
    >
      {/* Liseré intérieur, en retrait de 3,2 pt */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3.2px] rounded-[13px]"
        style={{
          border: "0.85px solid rgba(255,255,255,0.6)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 46%, rgba(184,155,209,0.18) 100%)",
        }}
      />

      <span
        className="relative flex h-[67px] w-[67px] items-center justify-center rounded-full text-[17px] font-semibold text-white"
        style={{ background: "#8E8E93", boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }}
      >
        {initials(name)}
      </span>

      <span className="relative mt-[8px] px-2 text-center text-[18px] leading-[1.15] font-semibold text-black">
        {first}
        <br />
        {last}
      </span>

      {picked && (
        <span
          className="absolute inset-0 flex items-center justify-center rounded-[16px]"
          style={{
            background:
              "linear-gradient(150deg, rgba(167,139,250,0.95), rgba(129,140,248,0.95) 55%, rgba(244,114,182,0.95))",
          }}
        >
          <Image
            src="/cap-180.png"
            alt=""
            width={60}
            height={60}
            className="animate-rise h-[60px] w-[60px] rounded-[14px]"
          />
        </span>
      )}
    </button>
  );
}

/* --------------------------------------------------------- écran reveal */

function RevealScreen({
  notifIn,
  onReplay,
}: {
  notifIn: boolean;
  onReplay: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between px-[22px] pt-[64px] pb-[44px]">
      {/* La notification qui tombe */}
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          notifIn ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        {/* Une vraie bannière iOS est bien plus lisible qu'un simple voile :
            c'est le moment fort de la démo, il doit se lire d'un coup d'œil. */}
        <div
          className="flex items-start gap-3 rounded-[20px] px-[14px] py-[12px] backdrop-blur-xl"
          style={{
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "0 12px 30px -8px rgba(0,0,0,0.65)",
          }}
        >
          <Image
            src="/cap-180.png"
            alt=""
            width={38}
            height={38}
            className="h-[38px] w-[38px] shrink-0 rounded-[9px]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[12px] font-bold tracking-wide text-white/70 uppercase">
                Stan
              </p>
              <p className="text-[11px] font-medium text-white/40">maintenant</p>
            </div>
            <p className="mt-[2px] text-[15px] leading-snug font-semibold text-white">
              Quelqu&apos;un vient de voter pour&nbsp;toi
            </p>
          </div>
        </div>
      </div>

      {/* Le message */}
      <div
        className={`flex flex-col items-center gap-4 text-center transition-all delay-300 duration-700 ${
          notifIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <Image
          src="/emoji/eyes.svg"
          alt=""
          width={86}
          height={86}
          className="h-[86px] w-[86px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]"
        />
        <h3 className="display text-[34px] text-white text-balance">
          Et toi, qui a voté pour toi&nbsp;?
        </h3>
        <p className="max-w-[270px] text-[16px] leading-relaxed font-medium text-white/55">
          Sur Stan, c&apos;est tes potes qui répondent. Toi, tu reçois la notif.
        </p>
      </div>

      {/* Sortie */}
      <div
        className={`flex flex-col items-center gap-4 transition-all delay-500 duration-700 ${
          notifIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <AppStoreButton
          className="w-full px-6! py-4! text-[17px]!"
          label="Découvrir qui"
        />
        <button
          onClick={onReplay}
          className="text-[14px] font-semibold text-white/40 transition hover:text-white/80"
        >
          ↻ Rejouer
        </button>
      </div>
    </div>
  );
}
