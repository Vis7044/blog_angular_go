"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType>({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
});

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const allowNavigationRef = useRef(false);
  const previousPathRef = useRef(pathname);

  // 1. Handle browser refresh/tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 2. Detect route changes and confirm navigation
  useEffect(() => {
    // If path changed and we didn't allow it, block it
    if (pathname !== previousPathRef.current) {
      if (hasUnsavedChanges && !allowNavigationRef.current) {
        // Navigation happened without permission - go back
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );

        if (!confirmLeave) {
          // Force back to previous route
          router.replace(previousPathRef.current);
          return;
        } else {
          // Allow and clear flag
          setHasUnsavedChanges(false);
        }
      }
      
      // Update previous path
      previousPathRef.current = pathname;
      allowNavigationRef.current = false;
    }
  }, [pathname, hasUnsavedChanges, router]);

  // 3. Intercept ALL clicks on anchor tags
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!hasUnsavedChanges) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || link.target === "_blank" || href.startsWith("http")) return;

      // Check if it's navigating away from current page
      const currentPath = window.location.pathname;
      if (href === currentPath) return;

      // Prevent default navigation
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Ask for confirmation
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );

      if (confirmLeave) {
        allowNavigationRef.current = true;
        setHasUnsavedChanges(false);
        
        // Navigate programmatically
        router.push(href);
      }
    };

    // Capture phase to intercept early
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [hasUnsavedChanges, router]);

  // 4. Handle browser back/forward
  useEffect(() => {
    console.log(hasUnsavedChanges)
    if (!hasUnsavedChanges) return;

    const handlePopState = () => {
      if (!allowNavigationRef.current) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );

        if (!confirmLeave) {
          window.history.pushState(null, "", window.location.href);
        } else {
          allowNavigationRef.current = true;
          setHasUnsavedChanges(false);
        }
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  return (
    <UnsavedChangesContext.Provider value={{ hasUnsavedChanges, setHasUnsavedChanges }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider");
  }
  return context;
}