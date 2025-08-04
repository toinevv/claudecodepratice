export interface ToolInfo {
  friendlyName: string;
  icon: string;
  loadingMessage: string;
  completedMessage: string;
}

const toolTranslations: Record<string, ToolInfo> = {
  str_replace_editor: {
    friendlyName: "Editing files",
    icon: "✏️",
    loadingMessage: "Working on your code...",
    completedMessage: "Files updated"
  },
  file_manager: {
    friendlyName: "Managing files", 
    icon: "📁",
    loadingMessage: "Organizing your project...",
    completedMessage: "Files organized"
  }
};

export function getToolInfo(toolName: string): ToolInfo {
  return toolTranslations[toolName] || {
    friendlyName: toolName,
    icon: "🔧",
    loadingMessage: "Processing...",
    completedMessage: "Complete"
  };
}

export function getUserExperienceMode(): "simple" | "developer" {
  if (typeof window === "undefined") return "simple";
  return (localStorage.getItem("userExperienceMode") as "simple" | "developer") || "simple";
}

export function setUserExperienceMode(mode: "simple" | "developer"): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userExperienceMode", mode);
  }
}