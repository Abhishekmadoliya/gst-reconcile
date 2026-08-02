import React from "react";

/**
 * TaxSolver wordmark logo.
 * Matches the style of the reference: lowercase, bold, tight tracking,
 * clean geometric sans-serif, single ink color.
 *
 * Usage:
 *   <TaxSolverLogo />
 *   <TaxSolverLogo size={32} color="#141414" />
 */
export default function TaxSolverLogo({ size = 28, color = "#141414", className = "" }) {
    return (
        <span
            className={className}
            style={{
                fontFamily:
                    "'Inter', 'Manrope', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color,
                display: "inline-flex",
                alignItems: "center",
                userSelect: "none",
            }}
        >
            taxsolver
        </span>
    );
}

/* ---- Standalone preview (for viewing this file directly) ---- */
// export function LogoPreview() {
//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 background: "#ffffff",
//             }}
//         >
//             <TaxSolverLogo size={40} />
//         </div>
//     );
// }