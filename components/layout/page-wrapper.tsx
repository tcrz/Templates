import type React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  useNestedContainer?: boolean;
}

export const PageWrapper = ({
  children,
  className = "",
  useNestedContainer = false
}: PageWrapperProps) => {
  return (
    <div
      className={`max-w-7xl xl:max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-6 py-4 ${className} min-h-[80svh]`}
    >
      {useNestedContainer ? (
        <div className="rounded-lg p-6 bg-white h-full">{children}</div>
      ) : (
        children
      )}
    </div>
  );
};
