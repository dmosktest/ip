import "./style.css";
import { detectLocale, t } from "./i18n";
import type { Locale } from "./site-config";

type MeResponse = { ip: string; country: string };

function isIsoCountry(code: string): boolean {
  return /^[A-Z]{2}$/.test(code);
}

function countryFlagUrl(code: string): string {
  return `/country-flags/${code.toLowerCase()}.png`;
}

function countryDisplayName(locale: Locale, code: string): string {
  const upper = code.trim().toUpperCase();
  if (!upper || upper === "XX" || upper === "NULL") {
    return t(locale, "countryUnknown");
  }
  if (upper === "PRIVATE") {
    return t(locale, "countryPrivate");
  }
  try {
    const names = new Intl.DisplayNames([locale === "tlh" ? "en" : locale], {
      type: "region",
    });
    return names.of(upper) ?? upper;
  } catch {
    return upper;
  }
}

function renderCountry(
  locale: Locale,
  codeRaw: string,
  countryEl: HTMLElement | null,
  flagEl: HTMLImageElement | null,
): void {
  const code = codeRaw.trim().toUpperCase();
  const name = countryDisplayName(locale, code);
  if (countryEl) {
    countryEl.textContent =
      isIsoCountry(code) && code !== "XX" ? `${name} (${code})` : name;
  }
  if (!flagEl) return;
  if (isIsoCountry(code) && code !== "XX") {
    flagEl.src = countryFlagUrl(code);
    flagEl.alt = "";
    flagEl.hidden = false;
  } else {
    flagEl.removeAttribute("src");
    flagEl.hidden = true;
  }
}

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/me", { cache: "no-store" });
  if (!res.ok) throw new Error(`status_${res.status}`);
  const data = (await res.json()) as MeResponse;
  return {
    ip: typeof data.ip === "string" ? data.ip : "",
    country: typeof data.country === "string" ? data.country : "",
  };
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function applyStaticI18n(locale: Locale): void {
  const copyBtn = document.getElementById("copy");
  if (copyBtn) {
    copyBtn.textContent = t(locale, "copy");
    copyBtn.setAttribute("aria-label", t(locale, "copyAria"));
  }
  const ipEl = document.getElementById("ip");
  if (ipEl) ipEl.setAttribute("aria-label", t(locale, "ipAria"));
}

function bindLangMenu(): void {
  const langRoot = document.querySelector<HTMLDetailsElement>(".lang");
  if (!langRoot) return;
  document.addEventListener("click", (event) => {
    if (!langRoot.open) return;
    const target = event.target;
    if (target instanceof Node && !langRoot.contains(target)) {
      langRoot.open = false;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && langRoot.open) langRoot.open = false;
  });
}

async function boot(): Promise<void> {
  const locale = detectLocale();
  applyStaticI18n(locale);
  bindLangMenu();

  const ipEl = document.getElementById("ip");
  const countryEl = document.getElementById("country-value");
  const flagEl = document.getElementById("country-flag") as HTMLImageElement | null;
  const statusEl = document.getElementById("status");
  const copyBtn = document.getElementById("copy") as HTMLButtonElement | null;
  const errorEl = document.getElementById("error");

  if (ipEl) ipEl.textContent = t(locale, "loading");
  if (statusEl) statusEl.textContent = "";
  if (flagEl) {
    flagEl.removeAttribute("src");
    flagEl.hidden = true;
  }

  let currentIp = "";

  try {
    const me = await fetchMe();
    currentIp = me.ip || "—";
    if (ipEl) ipEl.textContent = currentIp;
    renderCountry(locale, me.country, countryEl, flagEl);
    if (copyBtn) copyBtn.disabled = !me.ip;
  } catch {
    if (ipEl) ipEl.textContent = "—";
    if (countryEl) countryEl.textContent = t(locale, "countryUnknown");
    if (flagEl) {
      flagEl.removeAttribute("src");
      flagEl.hidden = true;
    }
    if (errorEl) errorEl.textContent = t(locale, "errorLoad");
    if (copyBtn) copyBtn.disabled = true;
    return;
  }

  copyBtn?.addEventListener("click", async () => {
    if (!currentIp || currentIp === "—") return;
    const ok = await copyText(currentIp);
    if (statusEl) {
      statusEl.textContent = ok ? t(locale, "copied") : "";
      window.setTimeout(() => {
        if (statusEl.textContent === t(locale, "copied")) {
          statusEl.textContent = "";
        }
      }, 1600);
    }
  });
}

void boot();
