"use client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

/**
 * SearchParamsWrapper - Reusable Suspense boundary for pages using useSearchParams()
 *
 * This wrapper solves the Next.js build error:
 * "useSearchParams() should be wrapped in a suspense boundary"
 *
 * USAGE EXAMPLE:
 *
 * import SearchParamsWrapper from "@/components/SearchParamsWrapper";
 * import { useSearchParams } from "next/navigation";
 *
 * // Your page content that needs search params
 * function MyPageContent() {
 *   const searchParams = useSearchParams();
 *   const search = searchParams.get('search');
 *
 *   return <div>Search: {search}</div>;
 * }
 *
 * // Main page export wrapped with SearchParamsWrapper
 * export default function MyPage() {
 *   return (
 *     <SearchParamsWrapper>
 *       <MyPageContent />
 *     </SearchParamsWrapper>
 *   );
 * }
 *
 * CUSTOM LOADING (Optional):
 * <SearchParamsWrapper fallback={<div>Custom loading...</div>}>
 *   <MyPageContent />
 * </SearchParamsWrapper>
 */
export default function SearchParamsWrapper({ children, fallback = null }) {
  // Default loading fallback matching your project's design system
  const defaultFallback = (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-red-500" />
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}
