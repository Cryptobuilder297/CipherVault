import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, TrendingUp, ArrowDownCircle, ArrowUpCircle, AlertCircle } from "lucide-react";
import { useListNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  deposit_approved: { icon: ArrowDownCircle, color: "text-emerald-400" },
  deposit_rejected: { icon: AlertCircle, color: "text-destructive" },
  withdrawal_approved: { icon: ArrowUpCircle, color: "text-emerald-400" },
  withdrawal_rejected: { icon: AlertCircle, color: "text-destructive" },
  investment_matured: { icon: TrendingUp, color: "text-amber-400" },
};

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useOutsideClick(ref, () => setOpen(false));

  const { data: notifications = [], isLoading, refetch } = useListNotifications();

  useEffect(() => {
    const id = setInterval(() => { refetch().catch(() => {}); }, 30_000);
    return () => clearInterval(id);
  }, [refetch]);

  const { mutate: markAllRead } = useMarkAllNotificationsRead({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    },
  });

  const { mutate: markOneRead } = useMarkNotificationRead({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Browser push notification when new unread arrives
  const prevUnreadRef = useRef(0);
  useEffect(() => {
    if (unreadCount > prevUnreadRef.current && prevUnreadRef.current !== 0) {
      const newest = notifications.find(n => !n.isRead);
      if (newest && "Notification" in window && Notification.permission === "granted") {
        new Notification(newest.title, {
          body: newest.message,
          icon: "/logo.svg",
          tag: String(newest.id),
        });
      }
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, notifications]);

  // Request browser notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  function handleOpen() {
    setOpen(o => !o);
  }

  function handleMarkOne(id: number) {
    markOneRead({ id });
  }

  function handleMarkAll(e: React.MouseEvent) {
    e.stopPropagation();
    markAllRead();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/6 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-white text-background text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-[13px] font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="py-10 flex items-center justify-center text-muted-foreground text-xs">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2 text-muted-foreground">
                <Bell className="w-8 h-8 opacity-20" />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => {
                const cfg = TYPE_CONFIG[notif.type] ?? { icon: AlertCircle, color: "text-muted-foreground" };
                const Icon = cfg.icon;
                return (
                  <button
                    key={notif.id}
                    onClick={() => !notif.isRead && handleMarkOne(notif.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
                      notif.isRead
                        ? "opacity-50 cursor-default"
                        : "hover:bg-white/4 cursor-pointer"
                    )}
                  >
                    <div className={cn("mt-0.5 flex-shrink-0", cfg.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground leading-tight mb-0.5">
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="mt-1 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
