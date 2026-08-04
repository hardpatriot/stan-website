"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppStoreButton } from "./AppStoreButton";
import { PhoneFrame } from "./PhoneFrame";

/* ---------------------------------------------------------------- données */

const QUESTIONS = [
  { emoji: "😁", text: "Qui a le plus beau sourire ?" },
  { emoji: "😂", text: "Qui te fait le plus rire ?" },
  { emoji: "🫶", text: "Sur qui on peut toujours compter ?" },
  { emoji: "🔥", text: "Qui a le plus de style ?" },
  { emoji: "✨", text: "Qui mérite plus d'attention ?" },
  { emoji: "🧠", text: "Qui a toujours la meilleure idée ?" },
];

const DEFAULT_FRIENDS = [
  "Lana Chung",
  "Lucas Chevalier",
  "Léa Sacla",
  "Noha Kanté",
];

const AVATAR_TINTS = [
  "from-[#f0abfc] to-[#c026d3]",
  "from-[#a5b4fc] to-[#4f46e5]",
  "from-[#fda4af] to-[#e11d48]",
  "from-[#7dd3fc] to-[#0284c7]",
];

const TOTAL_ROUNDS = 3;

/* --------------------------------------------------------------- utilitaires */

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

/* ------------------------------------------------------------------ écran */

type Stage = "vote" | "reveal";

export function VoteDemo() {
  const [friends, setFriends] = useState<string[]>(DEFAULT_FRIENDS);
  // Trio fixe au premier chargement : le rendu serveur et le rendu client doivent
  // être identiques, sinon React signale une erreur d'hydratation. Le mélange
  // n'intervient qu'au rejeu, déclenché par un clic.
  const [deck, setDeck] = useState(() => QUESTIONS.slice(0, TOTAL_ROUNDS));
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [stage, setStage] = useState<Stage>("vote");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [notifIn, setNotifIn] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // On nettoie tous les timers au démontage : sinon on setState sur un composant mort.
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  const question = deck[round] ?? deck[0];

  function vote(index: number) {
    if (picked !== null || stage !== "vote") return;
    setPicked(index);

    later(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        setStage("reveal");
        later(() => setNotifIn(true), 550);
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
    setRound(0);
    setPicked(null);
    setNotifIn(false);
    setStage("vote");
  }

  function skip() {
    if (stage !== "vote" || picked !== null) return;
    if (round + 1 >= TOTAL_ROUNDS) {
      setStage("reveal");
      later(() => setNotifIn(true), 550);
    } else {
      setRound((r) => r + 1);
    }
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
      <PhoneFrame className="w-[280px] sm:w-[310px]">
        {stage === "vote" ? (
          <VoteScreen
            question={question}
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

      <p className="text-center text-xs font-medium text-white/35">
        {stage === "vote"
          ? "Vas-y, vote — c'est une vraie démo."
          : "Voilà ce que ton pote reçoit."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- écran vote */

function VoteScreen({
  question,
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
    <div className="absolute inset-0 flex flex-col bg-[linear-gradient(175deg,#d91cbd_0%,#e6006e_100%)] px-4 pt-12 pb-5">
      {/* Progression */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-[15px] font-black tracking-tight text-white">
          {round + 1} sur {TOTAL_ROUNDS}
        </p>
        <div className="flex w-full gap-1.5">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
                i <= round ? "bg-white" : "bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div
        key={question.text}
        className="animate-rise mt-5 flex flex-col items-center gap-3"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[linear-gradient(160deg,#a78bfa,#6366f1)] text-2xl shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]">
          {question.emoji}
        </span>
        <h3 className="text-center text-[17px] leading-tight font-black tracking-tight text-white text-balance">
          {question.text}
        </h3>
      </div>

      {/* Ajout de potes */}
      {editing ? (
        <form onSubmit={onAdd} className="mt-4 flex gap-2">
          <input
            autoFocus
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
            maxLength={22}
            placeholder="Prénom d'un pote"
            className="min-w-0 flex-1 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-night-900 outline-none placeholder:text-black/35"
          />
          <button
            type="submit"
            aria-label="Ajouter ce pote"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/25 text-lg font-black text-white backdrop-blur-sm transition active:scale-90"
          >
            +
          </button>
        </form>
      ) : (
        <button
          onClick={onToggleEdit}
          className="mt-4 self-center rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold text-white/90 backdrop-blur-sm transition hover:bg-white/25"
        >
          ✏️ Mets les prénoms de tes potes
        </button>
      )}

      {/* Les 4 choix */}
      <div className="mt-4 grid flex-1 content-center grid-cols-2 gap-2.5">
        {friends.slice(0, 4).map((name, i) => {
          const isPicked = picked === i;
          const dimmed = picked !== null && !isPicked;
          return (
            <button
              key={`${name}-${i}`}
              onClick={() => onVote(i)}
              disabled={picked !== null}
              className={`relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl px-2 py-3.5 transition-all duration-500 ${
                isPicked
                  ? "scale-[1.04] bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)]"
                  : "bg-white/92 hover:bg-white"
              } ${dimmed ? "scale-95 opacity-35" : ""}`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_TINTS[i % 4]} text-[11px] font-black text-white`}
              >
                {initials(name)}
              </span>
              <span className="text-center text-[12px] leading-tight font-black tracking-tight text-night-900">
                {name}
              </span>

              {isPicked && (
                <span className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(150deg,rgba(217,28,189,0.94),rgba(230,0,110,0.94))]">
                  <span className="animate-rise text-2xl">🧢</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={onShuffle}
          disabled={picked !== null}
          className="rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/25 disabled:opacity-40"
        >
          🔀 Mélanger
        </button>
        <button
          onClick={onSkip}
          disabled={picked !== null}
          className="rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/25 disabled:opacity-40"
        >
          ⏩ Passer
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- écran reveal */

function RevealScreen({
  notifIn,
  onReplay,
}: {
  notifIn: boolean;
  onReplay: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(165deg,#0b0716_0%,#1f1445_60%,#2a1b5c_100%)] px-4 pt-12 pb-6">
      {/* La notification qui tombe */}
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          notifIn ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
      >
        <div className="glass flex items-start gap-2.5 rounded-2xl px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(150deg,#d91cbd,#e6006e)] text-base">
            🧢
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[10px] font-black tracking-wide text-white/70 uppercase">
                Stan
              </p>
              <p className="text-[9px] font-medium text-white/40">maintenant</p>
            </div>
            <p className="mt-0.5 text-[12px] leading-snug font-bold text-white">
              Quelqu&apos;un vient de voter pour&nbsp;toi&nbsp;👀
            </p>
          </div>
        </div>
      </div>

      {/* Le message */}
      <div
        className={`flex flex-col items-center gap-3 text-center transition-all delay-300 duration-700 ${
          notifIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="text-4xl">👀</span>
        <h3 className="display text-[26px] text-white text-balance">
          Et toi, qui a voté pour toi&nbsp;?
        </h3>
        <p className="max-w-[210px] text-[12px] leading-relaxed font-medium text-white/55">
          Sur Stan, c&apos;est tes potes qui répondent. Et tu reçois la notif.
        </p>
      </div>

      {/* Sortie */}
      <div
        className={`flex flex-col items-center gap-2.5 transition-all delay-500 duration-700 ${
          notifIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <AppStoreButton
          className="w-full px-5! py-3! text-[13px]!"
          label="Découvrir qui"
        />
        <button
          onClick={onReplay}
          className="text-[11px] font-bold text-white/40 transition hover:text-white/80"
        >
          ↻ Rejouer la démo
        </button>
      </div>
    </div>
  );
}
