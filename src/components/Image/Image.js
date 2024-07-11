import React from 'react'
import { ImageComponent } from './styled'

export const Image = ({
	src,
	className,
	width,
	height,
	alt,
	onClick,
	style,
}) => {
	return (
		<ImageComponent
			src={src}
			className={className}
			width={width}
			height={height}
			alt={alt}
			onClick={onClick}
			style={style}
		/>
	)
}
