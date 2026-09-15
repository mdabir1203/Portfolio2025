/**
 * WhatsApp Web auto-sender for bed-space outreach (Node.js version).
 *
 * What it does:
 *   1. Opens a tab to https://web.whatsapp.com/send?phone=<intl>&text=<encoded>
 *   2. You scan the QR once, then for each contact it pre-fills the chat.
 *   3. You press Enter in the terminal to advance to the next contact, then click Send in WhatsApp Web.
 *
 * Requirements:
 *   - Node.js 18+
 *   - A Chromium-based browser (Chrome / Edge / Brave) as default
 *   - WhatsApp Web already logged in (scan QR once)
 *
 * Usage:
 *   node send_whatsapp.cjs                 # interactive (press Enter between contacts)
 *   node send_whatsapp.cjs --auto --delay 8    # no prompt, 8s between contacts
 *   node send_whatsapp.cjs --csv contacts.csv
 *
 * Customize:
 *   - Edit DEFAULT_CONTACTS below, OR
 *   - Pass --csv contacts.csv with columns: name,phone,message
 */

const fs = require('node:fs');
const path = require('node:path');
const { exec } = require('node:child_process');
const os = require('node:os');

const DEFAULT_CONTACTS = [
  {
    name: 'Satwa Bedspace Instagram (ladies)',
    phone: '+971529331188',
    message:
      'Hi, saw your Satwa bedspace listing. Single working professional, looking for bed space AED 600-700, Satwa or Al Jafiliya, walking distance to Max Metro. Need lower bunk + window bed. Available now?',
  },
  {
    name: 'Satwa Big Mosque capsule partition',
    phone: '+971522884786',
    message:
      'Hi, saw your capsule partition listing near Satwa Big Mosque. Is it still available? Single working professional, bed space AED 600-700 in Satwa, walking distance to Max Metro. Need lower bunk + window bed.',
  },
  {
    name: 'Satwa Roundabout (Abu Nasir)',
    phone: '+971566353859',
    message:
      'Hi Abu Nasir, saw your Satwa Roundabout bedspace listing. Is the lower bed (AED 650) still available? Single working professional, working near WTC. When can I visit?',
  },
  {
    name: 'Satwa FB Group admin (Nazir Karim)',
    phone: '+971563229004',
    message:
      'Hi Nazir, just joined the Satwa Bedspace group. Looking for bed space AED 600-700, Satwa or Al Jafiliya, walking distance to Max Metro. Lower bunk + window bed. Any current options?',
  },
  {
    name: 'Karama Bed Space FB admin (Rez Ez)',
    phone: '+971551519645',
    message:
      'Hi Rez, just joined the Karama Bed Space group. Looking for bed space AED 600-700 in Karama, near ADCB or Burjuman Metro. Lower bunk + window bed. Any current options? Move-in ASAP.',
  },
  {
    name: 'rentforroom.com Satwa (Abu Nasir)',
    phone: '+971503569919',
    message:
      'Hi, saw your Satwa listings on rentforroom.com. Looking for bed space AED 600-700 in Satwa, walking distance to Max Metro. Lower bunk + window bed. What do you have available now?',
  },
  {
    name: 'rentforroom Karama 1',
    phone: '+971508870458',
    message:
      'Hi, looking for bed space AED 600-700 in Karama, near ADCB or Burjuman Metro. Lower bunk + window bed. What do you have available now? Move-in ASAP.',
  },
  {
    name: 'rentforroom Karama 2',
    phone: '+971501659458',
    message:
      'Hi, looking for bed space AED 600-700 in Karama, near ADCB or Burjuman Metro. Lower bunk + window bed. What do you have available now? Move-in ASAP.',
  },
  {
    name: 'rentforroom Karama 3',
    phone: '+971567957047',
    message:
      'Hi, looking for bed space AED 600-700 in Karama, near ADCB or Burjuman Metro. Lower bunk + window bed. What do you have available now? Move-in ASAP.',
  },
];

function parseArgs(argv) {
  const args = { delay: 4, start: 0, auto: false, csv: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--auto') args.auto = true;
    else if (a === '--delay') args.delay = parseFloat(argv[++i]);
    else if (a === '--start') args.start = parseInt(argv[++i], 10);
    else if (a === '--csv') args.csv = argv[++i];
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node send_whatsapp.cjs [--auto] [--delay SECONDS] [--start N] [--csv FILE]');
      process.exit(0);
    }
  }
  return args;
}

function loadCsv(csvPath) {
  const text = fs.readFileSync(csvPath, 'utf8');
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const header = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const obj = {};
    header.forEach((h, i) => (obj[h.trim()] = (cols[i] || '').trim()));
    return {
      name: obj.name || obj.phone,
      phone: obj.phone,
      message: obj.message,
    };
  });
}

function parseCsvLine(line) {
  // Simple CSV parser handling quoted fields with escaped quotes
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function openBrowser(url) {
  // Windows: 'start' command, macOS: 'open', Linux: 'xdg-open'
  const plat = os.platform();
  let cmd;
  if (plat === 'win32') cmd = `start "" "${url}"`;
  else if (plat === 'darwin') cmd = `open "${url}"`;
  else cmd = `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) console.error('Failed to open browser:', err.message);
  });
}

function openChat(phone, message) {
  const digits = phone.replace(/[^\d+]/g, '');
  const e164 = digits.startsWith('+') ? digits : '+' + digits;
  const url = `https://web.whatsapp.com/send?phone=${encodeURIComponent(e164)}&text=${encodeURIComponent(message)}`;
  openBrowser(url);
}

function ask(question) {
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
    process.stdout.write(question);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = parseArgs(process.argv);
  const contacts = args.csv ? loadCsv(path.resolve(args.csv)) : DEFAULT_CONTACTS;
  const slice = contacts.slice(args.start);

  console.log(`\nLoaded ${slice.length} contact(s).`);
  console.log('Make sure WhatsApp Web is already logged in (https://web.whatsapp.com).');
  console.log('For each contact, a browser tab will open with the chat pre-filled.');
  console.log('Click Send in WhatsApp, then press Enter here for the next contact.\n');

  for (let i = 0; i < slice.length; i++) {
    const c = slice[i];
    const idx = args.start + i + 1;
    console.log(`\n[${idx}/${contacts.length}] ${c.name}`);
    console.log(`   Phone:   ${c.phone}`);
    const preview = c.message.length > 80 ? c.message.slice(0, 80) + '...' : c.message;
    console.log(`   Message: ${preview}`);
    openChat(c.phone, c.message);
    if (args.auto) {
      await sleep(args.delay * 1000);
    } else {
      const ans = await ask('   Press Enter for next contact (Ctrl+C to quit)...');
      if (ans && ans.toLowerCase() === 'q') {
        console.log('Stopped.');
        break;
      }
    }
  }
  console.log('\nAll contacts opened. Now click Send in each WhatsApp tab.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
