importScripts("schedule.js");

const { schedule } = self.MeetingTimer;

chrome.commands.onCommand.addListener(async (command) => {
  const { session } = await chrome.storage.local.get("session");
  if (!session) return;
  if (command === "next-section") {
    await chrome.storage.local.set({ session: schedule.startTurn(session, session.position + 1, Date.now()) });
  } else if (command === "toggle-overlay") {
    await chrome.storage.local.set({ session: { ...session, hidden: !session.hidden } });
  }
});

async function updateBadge() {
  const { session } = await chrome.storage.local.get("session");
  await chrome.action.setBadgeBackgroundColor({ color: "#0f766e" });
  await chrome.action.setBadgeText({ text: session ? "ON" : "" });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "session" in changes) updateBadge();
});
chrome.runtime.onInstalled.addListener(updateBadge);
chrome.runtime.onStartup.addListener(updateBadge);
