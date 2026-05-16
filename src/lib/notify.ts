type AppNotificationTone = "success" | "warning" | "neutral" | "danger";

export function notifyApp(input: { detail: string; title: string; tone?: AppNotificationTone }) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("editins:notify", {
      detail: {
        tone: "warning",
        ...input,
      },
    }),
  );
}
