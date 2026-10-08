import { Plug, PlugZap, ToggleLeft, ToggleRight, Activity } from "lucide-react";
import type { ConnectionStatus } from "@/lib/types";

interface ConnectionBarProps {
  status: ConnectionStatus;
  demoMode: boolean;
  onToggleConnection: () => void;
  onToggleDemo: () => void;
}

export function ConnectionBar({
  status,
  demoMode,
  onToggleConnection,
  onToggleDemo,
}: ConnectionBarProps) {
  const isConnected = status === "connected";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur p-3">
      {/* Connection status */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60">
        {isConnected ? (
          <PlugZap className="h-4 w-4 text-emerald-400" />
        ) : (
          <Plug className="h-4 w-4 text-gray-500" />
        )}
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-gray-600"
            }`}
          />
          <span className={`text-sm font-medium ${isConnected ? "text-emerald-400" : "text-gray-500"}`}>
            {isConnected ? "Arduino Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="h-6 w-px bg-slate-700/50 hidden sm:block" />

      {/* Connection toggle */}
      <button
        onClick={onToggleConnection}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
          isConnected
            ? "text-emerald-400 hover:bg-emerald-500/10"
            : "text-gray-400 hover:bg-slate-700/40"
        }`}
      >
        {isConnected ? (
          <ToggleRight className="h-5 w-5" />
        ) : (
          <ToggleLeft className="h-5 w-5" />
        )}
        <span className="hidden sm:inline">{isConnected ? "Connected" : "Connect"}</span>
      </button>

      {/* Demo mode toggle */}
      <button
        onClick={onToggleDemo}
        disabled={!isConnected}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
          demoMode
            ? "text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20"
            : "text-gray-400 hover:bg-slate-700/40"
        }`}
      >
        <Activity className="h-4 w-4" />
        <span>Demo Mode {demoMode ? "ON" : "OFF"}</span>
      </button>

      {demoMode && isConnected && (
        <span className="ml-auto text-xs text-cyan-400/60 animate-pulse hidden md:block">
          Simulating sensor data...
        </span>
      )}
    </div>
  );
}
