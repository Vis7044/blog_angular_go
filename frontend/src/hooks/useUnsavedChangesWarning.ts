"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";


export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  // 1️⃣ Handle browser refresh / tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 2️⃣ Handle Next.js in-app navigation
  useEffect(() => {
    if (pathname !== prevPath.current && hasUnsavedChanges) {
      const confirmLeave = confirm("You have unsaved changes. Leave anyway?");
      if (!confirmLeave) {
        // stay on same page
        router.replace(prevPath.current);
        return;
      }
    }
    prevPath.current = pathname;
  }, [pathname, hasUnsavedChanges, router]);
}
