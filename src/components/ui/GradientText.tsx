import "./GradientText.css"
import React, { ReactNode, isValidElement, cloneElement } from "react"

interface GradientTextProps {
	children: ReactNode
	className?: string
	colors?: string[]
	animationSpeed?: number
	showBorder?: boolean
}

export default function GradientText({
	children,
	className = "",
	colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
	animationSpeed = 8,
	showBorder = false,
}: GradientTextProps) {
	const gradientStyle = {
		backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
		animationDuration: `${animationSpeed}s`,
	} as React.CSSProperties

	const content = isValidElement(children)
		? cloneElement(children as React.ReactElement<any>, {
			// Apply gradient to each character if supported by child
			charClassName: `${(children as any).props?.charClassName ?? ""} gradient-text-fill`.trim(),
			charStyle: { ...(children as any).props?.charStyle, ...gradientStyle },
		})
		: (
			<span className="gradient-text-fill" style={gradientStyle}>{children}</span>
		)

	return (
		<span className={`animated-gradient-text ${className}`}>
			{showBorder && (
				<span className="gradient-overlay" style={gradientStyle}></span>
			)}
			{content}
		</span>
	)
}


