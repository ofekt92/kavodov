import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../i18n";

/** Chevron pointing left; `flip` mirrors it to point right. */
function Chevron({ flip }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M15 5 8 12l7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const RESUME_AFTER = 5000; // idle time before autoplay picks back up

/**
 * Draggable slider around an arbitrary list of cards. Loops forever and
 * advances on its own; a deliberate interaction (drag, arrow/dot click, keyboard
 * focus) halts autoplay, which restarts RESUME_AFTER ms after the user stops.
 * Hovering alone does not pause it.
 * Embla is re-created on language change so RTL/LTR drag direction stays correct.
 *
 * `delay` should be set from how long the slide takes to read — a slide of body
 * copy needs far longer than the 3.5s that suits a bare image.
 */
export default function Carousel({ children, ariaLabel, delay = 5000 }) {
  const { t, i18n } = useTranslation();
  const dir = (LANGUAGES[i18n.language] || LANGUAGES[DEFAULT_LANGUAGE]).dir;

  const [emblaRef, embla] = useEmblaCarousel(
    {
      direction: dir,
      align: "start",
      containScroll: false, // loop needs the untrimmed snap list
      loop: true,
      skipSnaps: false,
      // one card at a time on phones, centered so both neighbours peek evenly
      breakpoints: { "(max-width: 620px)": { align: "center" } },
    },
    [
      // every stop/resume rule is handled below, so the plugin's own ones are off
      Autoplay({
        delay,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
        playOnInit: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      }),
    ],
  );

  const [snaps, setSnaps] = useState([]);
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    onSelect();
    embla.on("select", onSelect).on("reInit", () => {
      setSnaps(embla.scrollSnapList());
      onSelect();
    });
  }, [embla, onSelect]);

  /* ── autoplay pause/resume ────────────────────────────────
     hold() stops it for as long as the interaction lasts;
     release() restarts the 5s countdown once the user is done. */
  const resumeTimer = useRef(null);
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => clearTimeout(resumeTimer.current);
  }, []);

  const autoplay = () => embla && embla.plugins().autoplay;

  const hold = useCallback(() => {
    clearTimeout(resumeTimer.current);
    const ap = autoplay();
    if (ap) ap.stop();
  }, [embla]);

  const release = useCallback(() => {
    clearTimeout(resumeTimer.current);
    if (reducedMotion.current) return;
    resumeTimer.current = setTimeout(() => {
      const ap = autoplay();
      if (ap) ap.play();
    }, RESUME_AFTER);
  }, [embla]);

  // a drag counts as interaction too
  useEffect(() => {
    if (!embla) return;
    embla.on("pointerDown", hold).on("pointerUp", release);
    return () => {
      embla.off("pointerDown", hold);
      embla.off("pointerUp", release);
    };
  }, [embla, hold, release]);

  /** Button handler: move, then start the 5s idle countdown. */
  const nudge = (fn) => () => {
    if (!embla) return;
    hold();
    fn();
    release();
  };

  // prev sits on the right in RTL, so each arrow points at the outer edge.
  // Drawn as SVG on purpose: ‹ and › are bidi-mirrored and flip in RTL text.
  const rtl = dir === "rtl";

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onFocusCapture={hold}
      onBlurCapture={release}
    >
      <div className="carousel-viewport" ref={emblaRef}>
        <div className="carousel-track">
          {children.map((child, i) => (
            <div className="carousel-slide" key={i}>{child}</div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-arrow"
          onClick={nudge(() => embla.scrollPrev())}
          disabled={!canPrev}
          aria-label={t("carousel.prev")}
        >
          <Chevron flip={rtl} />
        </button>

        <div className="carousel-dots">
          {snaps.map((_, i) => (
            <button
              type="button"
              key={i}
              className={"carousel-dot" + (i === selected ? " is-active" : "")}
              onClick={nudge(() => embla.scrollTo(i))}
              aria-label={t("carousel.goTo", { n: i + 1 })}
              aria-current={i === selected}
            />
          ))}
        </div>

        <button
          type="button"
          className="carousel-arrow"
          onClick={nudge(() => embla.scrollNext())}
          disabled={!canNext}
          aria-label={t("carousel.next")}
        >
          <Chevron flip={!rtl} />
        </button>
      </div>
    </div>
  );
}
