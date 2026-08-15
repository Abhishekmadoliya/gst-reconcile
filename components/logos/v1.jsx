import React from "react";

/**
 * TaxSolver wordmark logo.
 * Matches the style of the reference: lowercase, bold, tight tracking,
 * clean geometric sans-serif, adaptive to light and dark themes.
 *
 * Usage:
 *   <TaxSolverLogo />
 *   <TaxSolverLogo size={32} />
 *   <TaxSolverLogo size={32} color="#141414" />
 *
 * @param {{ size?: number, color?: string, className?: string }} props
 */
export default function TaxSolverLogo({ size = 28, color = "", className = "" }) {
    return (
        <span
            className={`text-foreground transition-colors duration-200 ${className}`}
            style={{
                fontFamily:
                    "'Inter', 'Manrope', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: color || "currentColor",
                display: "inline-flex",
                alignItems: "center",
                userSelect: "none",
            }}
        >
            taxsolver
        </span>
    );
}
