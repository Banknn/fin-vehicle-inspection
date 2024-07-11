import React from 'react'
import { StepComponent, StepsComponent } from './styled'

export const Step = ({
	current,
	direction,
	steps,
	progressDot,
	onChange,
	className,
}) => {
	return (
		<StepsComponent
			className={className}
			progressDot={progressDot}
			current={current}
			direction={direction}
			onChange={onChange}
		>
			{steps.map((e, i) => {
				return (
					<StepComponent
						key={i}
						title={e.title}
						description={e.description}
						icon={e.icon}
						disabled={e.disabled}
					/>
				)
			})}
		</StepsComponent>
	)
}
