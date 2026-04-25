// scripts/bump-legal-version.ts
// Ablage: scripts/bump-legal-version.ts  (im Projekt-Root neben package.json)
//
// Einmalig installieren:
//   npm install nodemailer @types/nodemailer ts-node dotenv --save-dev
//
// GitHub Secrets setzen (Repo → Settings → Secrets → Actions):
//   DATABASE_URL  →  deine Neon-URL
//   SMP_USER      →  deine Absender-E-Mail
//   SMP_PASS      →  dein E-Mail-Passwort

import fs               from "fs"
import path             from "path"
import { execSync }     from "child_process"
import nodemailer       from "nodemailer"
import { PrismaClient } from "@prisma/client"
import "dotenv/config"

const prisma = new PrismaClient()

// ── E-Mail Setup ──────────────────────────────────────────────────────────
const SMP_USER = process.env.SMP_USER ?? ""
const SMP_PASS = process.env.SMP_PASS ?? ""

const transporter = nodemailer.createTransport({
  service: "gmail",   // bei anderem Anbieter: "gmx", "web.de", "outlook" etc.
  auth: {
    user: SMP_USER,
    pass: SMP_PASS,
  },
})

const PLATFORM_URL = "https://astroplaysbot.de"
const SENDER_NAME  = "AstroPlays"

// ── Dokument-Konfiguration ────────────────────────────────────────────────
const DOC_CONFIG = {
  agb: {
    label:     "Allgemeine Geschäftsbedingungen (AGB)",
    url:       `${PLATFORM_URL}/AGB`,
    filePath:  path.resolve(__dirname, "../src/app/(legal)/AGB/page.tsx"),
    layoutKey: "/AGB",
  },
  dsgvo: {
    label:     "Datenschutzerklärung",
    url:       `${PLATFORM_URL}/Datenschutz`,
    filePath:  path.resolve(__dirname, "../src/app/(legal)/Datenschutz/page.tsx"),
    layoutKey: "/Datenschutz",
  },
  impressum: {
    label:     "Impressum",
    url:       `${PLATFORM_URL}/Impressum`,
    filePath:  path.resolve(__dirname, "../src/app/(legal)/Impressum/page.tsx"),
    layoutKey: "/Impressum",
  },
} as const

type DocKey = keyof typeof DOC_CONFIG

const LAYOUT_FILE = path.resolve(__dirname, "../src/app/(legal)/layout.tsx")

// git-Pfad → DocKey
const FILE_TO_DOC: Record<string, DocKey> = {
  "src/app/(legal)/AGB/page.tsx":         "agb",
  "src/app/(legal)/Datenschutz/page.tsx": "dsgvo",
  "src/app/(legal)/Impressum/page.tsx":   "impressum",
}

// ── Versions-Helfer ───────────────────────────────────────────────────────
function bumpVersion(current: string, type: "major" | "minor"): string {
  const [major, minor] = current.split(".").map(Number)
  return type === "major" ? `${major + 1}.0` : `${major}.${minor + 1}`
}

function todayDE(): string {
  const d  = new Date()
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}.${mm}.${d.getFullYear()}`
}

// ── Erkennt welche Legal-Dateien im letzten Commit geändert wurden ─────────
function getChangedDocs(): DocKey[] {
  try {
    const output = execSync("git diff --name-only HEAD~1 HEAD", {
      encoding: "utf-8",
    }).trim()
    const changed = new Set<DocKey>()
    for (const file of output.split("\n").map(f => f.trim())) {
      const key = FILE_TO_DOC[file]
      if (key) changed.add(key)
    }
    return Array.from(changed)
  } catch {
    return []
  }
}

// ── page.tsx aktualisieren ────────────────────────────────────────────────
function updatePageFile(filePath: string, newVersion: string, newDate: string): void {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ Nicht gefunden: ${filePath}`)
    return
  }
  let content = fs.readFileSync(filePath, "utf-8")

  // Kommentar-Header
  content = content.replace(/(\/\/ VERSION:\s+)[\d.]+/, `$1${newVersion}`)
  content = content.replace(/(\/\/ STAND:\s+)[\d.]+/,   `$1${newDate}`)

  // JSX Footer
  content = content.replace(/(<p>Version: )[\d.]+(<\/p>)/, `$1${newVersion}$2`)
  content = content.replace(/(<p>Stand: )[\d.]{10}(<\/p>)/, `$1${newDate}$2`)

  fs.writeFileSync(filePath, content, "utf-8")
  console.log(`  ✓ page.tsx → V${newVersion} (${newDate})`)
}

// ── layout.tsx Sidebar-Badge aktualisieren ────────────────────────────────
function updateLayoutFile(layoutKey: string, newVersion: string, newDate: string): void {
  if (!fs.existsSync(LAYOUT_FILE)) {
    console.warn(`  ⚠ layout.tsx nicht gefunden`)
    return
  }
  let content = fs.readFileSync(LAYOUT_FILE, "utf-8")

  content = content.replace(
    new RegExp(`("${layoutKey}":[^}]*version:\\s*")[^"]+"`),
    `$1${newVersion}"`
  )
  content = content.replace(
    new RegExp(`("${layoutKey}":[^}]*date:\\s*")[^"]+"`),
    `$1${newDate}"`
  )

  fs.writeFileSync(LAYOUT_FILE, content, "utf-8")
  console.log(`  ✓ layout.tsx → ${layoutKey} V${newVersion}`)
}

// ── E-Mail an alle DashboardUser mit E-Mail ───────────────────────────────
async function notifyUsers(
  config:     typeof DOC_CONFIG[DocKey],
  newVersion: string,
  isMajor:    boolean
): Promise<void> {
  if (!SMP_USER || !SMP_PASS) {
    console.log("  ⚠ SMP_USER oder SMP_PASS fehlt — kein Versand")
    return
  }

  // Alle DashboardUser mit gesetzter E-Mail
  const users = await prisma.dashboardUser.findMany({
    where:  { email: { not: null } },
    select: { email: true, username: true },
  })

  if (users.length === 0) {
    console.log("  ℹ Keine User mit E-Mail — kein Versand")
    return
  }

  console.log(`  📧 Sende an ${users.length} User...`)
  let ok = 0, fail = 0

  for (const user of users) {
    if (!user.email) continue
    try {
      await transporter.sendMail({
        from:    `"${SENDER_NAME}" <${SMP_USER}>`,
        to:      user.email,
        subject: isMajor
          ? `Wichtige Änderung: ${config.label} aktualisiert (V${newVersion})`
          : `Hinweis: ${config.label} aktualisiert (V${newVersion})`,
        html: buildEmail({
          userName:   user.username,
          docLabel:   config.label,
          docUrl:     config.url,
          newVersion,
          isMajor,
        }),
      })
      ok++
    } catch (err) {
      fail++
      console.warn(`  ✗ ${user.email}: ${(err as Error).message}`)
    }
    await new Promise(r => setTimeout(r, 100))
  }

  console.log(`  ✓ Gesendet: ${ok}   Fehler: ${fail}`)
}

// ── E-Mail HTML ───────────────────────────────────────────────────────────
function buildEmail(opts: {
  userName: string; docLabel: string; docUrl: string
  newVersion: string; isMajor: boolean
}): string {
  const { userName, docLabel, docUrl, newVersion, isMajor } = opts
  const accent   = isMajor ? "#ef4444"                 : "#818cf8"
  const badgeBg  = isMajor ? "rgba(239,68,68,0.12)"   : "rgba(99,102,241,0.12)"
  const badgeBd  = isMajor ? "rgba(239,68,68,0.3)"    : "rgba(99,102,241,0.3)"
  const badgeTxt = isMajor ? "⚠ Wichtige Änderung"   : "ℹ Aktualisierung"

  return `<!DOCTYPE html><html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#06060e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#d1d5db;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">

  <div style="text-align:center;margin-bottom:28px;">
    <span style="font-size:20px;font-weight:900;color:#fff;">AstroPlays</span>
  </div>

  <div style="background:#0d0d1a;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:32px;">

    <div style="display:inline-block;background:${badgeBg};border:1px solid ${badgeBd};
                border-radius:99px;padding:4px 14px;font-size:11px;font-weight:700;
                color:${accent};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:18px;">
      ${badgeTxt}
    </div>

    <h1 style="margin:0 0 14px;font-size:19px;font-weight:800;color:#fff;line-height:1.3;">
      ${docLabel} wurde aktualisiert
    </h1>

    <p style="margin:0 0 4px;font-size:14px;color:#9ca3af;">
      Hallo <strong style="color:#e5e7eb;">${userName}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:#9ca3af;">
      unsere <strong style="color:#e5e7eb;">${docLabel}</strong> wurde auf
      <strong style="color:#fff;">Version ${newVersion}</strong> aktualisiert
      und gilt ab sofort für alle Nutzer von AstroPlays.
    </p>

    ${isMajor ? `
    <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.18);
                border-radius:10px;padding:14px 16px;margin-bottom:22px;">
      <p style="margin:0;font-size:13px;line-height:1.55;color:#fca5a5;">
        <strong>Bei wesentlichen Änderungen</strong> hast du das Recht,
        laufende Abonnements innerhalb von 14 Tagen außerordentlich zu kündigen.
        Kontakt: <a href="mailto:${SMP_USER}" style="color:#f87171;">${SMP_USER}</a>
      </p>
    </div>` : ""}

    <a href="${docUrl}"
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);
              color:#fff;text-decoration:none;font-weight:700;font-size:14px;
              padding:12px 26px;border-radius:10px;margin-bottom:26px;">
      Dokument lesen →
    </a>

    <p style="margin:0;font-size:12px;color:#4b5563;border-top:1px solid rgba(255,255,255,0.06);padding-top:18px;">
      Du erhältst diese E-Mail als registrierter Nutzer von AstroPlays.<br>
      Fragen? <a href="mailto:${SMP_USER}" style="color:#6366f1;">${SMP_USER}</a>
    </p>

  </div>

  <p style="text-align:center;color:#374151;font-size:11px;margin-top:20px;">
    AstroPlays · ${PLATFORM_URL} · V${newVersion}
  </p>

</div>
</body></html>`
}

// ── Hauptprogramm ─────────────────────────────────────────────────────────
async function main() {
  const args      = process.argv.slice(2)
  const isAuto    = args.includes("--auto")
  const commitMsg = process.env.COMMIT_MESSAGE ?? ""
  const isMajor   = commitMsg.toUpperCase().includes("MAJOR UPDATE")
  const bumpType  = isMajor ? "major" : "minor"

  let docs: DocKey[] = []

  if (isAuto) {
    docs = getChangedDocs()
    if (docs.length === 0) {
      console.log("ℹ Keine Legal-Dateien geändert — nichts zu tun.")
      await prisma.$disconnect()
      return
    }
    console.log(`\n🔍 Geänderte Dokumente: ${docs.join(", ")}`)
    console.log(`   Typ: ${bumpType}${isMajor ? "  ← MAJOR UPDATE in Commit-Message" : ""}\n`)
  } else {
    const docArg = args[args.indexOf("--doc") + 1] as DocKey | undefined
    if (!docArg || !DOC_CONFIG[docArg]) {
      console.error("❌ --doc muss 'agb', 'dsgvo' oder 'impressum' sein")
      process.exit(1)
    }
    docs = [docArg]
  }

  for (const docKey of docs) {
    const config = DOC_CONFIG[docKey]
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`  ${config.label}`)

    const record = await prisma.legalDocVersion.findUnique({
      where: { id: docKey },
    })
    const currentVersion = record?.version ?? "1.0"
    const newVersion     = bumpVersion(currentVersion, bumpType)
    const newDate        = todayDE()

    console.log(`  ${currentVersion} → ${newVersion}  (${newDate})\n`)

    updatePageFile(config.filePath, newVersion, newDate)
    updateLayoutFile(config.layoutKey, newVersion, newDate)

    await prisma.legalDocVersion.upsert({
      where:  { id: docKey },
      update: { version: newVersion },
      create: { id: docKey, version: newVersion },
    })
    console.log(`  ✓ DB gespeichert\n`)

    await notifyUsers(config, newVersion, isMajor)
    console.log()
  }

  await prisma.$disconnect()
  console.log("✅ Fertig.")
}

main().catch(err => {
  console.error("❌ Fehler:", err)
  prisma.$disconnect()
  process.exit(1)
})
